/**
 * React hook for managing Click & Collect pickup mode state
 */

import { useState, useEffect, useCallback } from "react";
import type { Location, WarehouseInfo } from "../types";
import { PickupServiceClient } from "../utils/pickupServiceClient";
import { getCurrentLocation } from "../utils/locationUtils";
import {
	storeWarehouse,
	storeWarehouseData,
	getStoredWarehouse,
	getStoredWarehouseData,
	clearWarehouse,
	storePickupMode,
	getStoredPickupMode,
	clearAllPickupStorage,
} from "../utils/storageUtils";

export interface UsePickupModeOptions {
	pickupService: PickupServiceClient;
	onError?: (error: Error) => void;
	onWarehouseSelected?: (warehouse: WarehouseInfo) => void;
	autoLoadStored?: boolean;
}

export interface UsePickupModeReturn {
	// State
	enabled: boolean;
	selectedWarehouse: WarehouseInfo | null;
	warehouses: WarehouseInfo[];
	userLocation: Location | null;
	loading: boolean;
	error: string | null;

	// Actions
	enablePickupMode: () => Promise<void>;
	disablePickupMode: () => void;
	selectWarehouse: (warehouse: WarehouseInfo) => Promise<void>;
	refreshWarehouses: (location?: Location) => Promise<void>;
	clearError: () => void;
}

export function usePickupMode(options: UsePickupModeOptions): UsePickupModeReturn {
	const { pickupService, onError, onWarehouseSelected, autoLoadStored = true } = options;

	const [enabled, setEnabled] = useState(false);
	const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseInfo | null>(null);
	const [warehouses, setWarehouses] = useState<WarehouseInfo[]>([]);
	const [userLocation, setUserLocation] = useState<Location | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Load stored state on mount
	useEffect(() => {
		if (autoLoadStored) {
			const storedMode = getStoredPickupMode();
			const storedWarehouse = getStoredWarehouseData();

			if (storedMode && storedWarehouse) {
				setEnabled(true);
				setSelectedWarehouse(storedWarehouse);
			}
		}
	}, [autoLoadStored]);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	const handleError = useCallback(
		(err: Error) => {
			setError(err.message);
			setLoading(false);
			if (onError) {
				onError(err);
			}
		},
		[onError],
	);

	const enablePickupMode = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			// Get user location
			const location = await getCurrentLocation();
			setUserLocation(location);

			// Discover warehouses
			const discoveredWarehouses = await pickupService.discoverWarehouses(location);
			setWarehouses(discoveredWarehouses);

			if (discoveredWarehouses.length === 0) {
				throw new Error("No pickup locations found nearby. Try expanding your search radius.");
			}

			// If we have a stored warehouse, try to use it if it's still in the list
			const storedWarehouseId = getStoredWarehouse();
			if (storedWarehouseId) {
				const storedWarehouse = discoveredWarehouses.find((w) => w.id === storedWarehouseId);
				if (storedWarehouse) {
					await selectWarehouse(storedWarehouse);
				}
			}

			setEnabled(true);
			storePickupMode(true);
		} catch (err) {
			handleError(err instanceof Error ? err : new Error("Failed to enable pickup mode"));
		} finally {
			setLoading(false);
		}
	}, [pickupService, handleError]);

	const disablePickupMode = useCallback(() => {
		setEnabled(false);
		setSelectedWarehouse(null);
		setWarehouses([]);
		setUserLocation(null);
		clearAllPickupStorage();
		storePickupMode(false);
	}, []);

	const selectWarehouse = useCallback(
		async (warehouse: WarehouseInfo) => {
			setLoading(true);
			setError(null);

			try {
				await pickupService.selectWarehouse(warehouse.id);
				setSelectedWarehouse(warehouse);
				storeWarehouse(warehouse.id);
				storeWarehouseData(warehouse);

				if (onWarehouseSelected) {
					onWarehouseSelected(warehouse);
				}
			} catch (err) {
				handleError(err instanceof Error ? err : new Error("Failed to select warehouse"));
			} finally {
				setLoading(false);
			}
		},
		[pickupService, onWarehouseSelected, handleError],
	);

	const refreshWarehouses = useCallback(
		async (location?: Location) => {
			setLoading(true);
			setError(null);

			try {
				const loc = location || userLocation;
				if (!loc) {
					throw new Error("Location is required to refresh warehouses");
				}

				const discoveredWarehouses = await pickupService.discoverWarehouses(loc);
				setWarehouses(discoveredWarehouses);
				setUserLocation(loc);

				// Update selected warehouse if it's still in the list
				if (selectedWarehouse) {
					const updatedWarehouse = discoveredWarehouses.find((w) => w.id === selectedWarehouse.id);
					if (updatedWarehouse) {
						setSelectedWarehouse(updatedWarehouse);
						storeWarehouseData(updatedWarehouse);
					} else {
						// Selected warehouse no longer available
						setSelectedWarehouse(null);
						clearWarehouse();
					}
				}
			} catch (err) {
				handleError(err instanceof Error ? err : new Error("Failed to refresh warehouses"));
			} finally {
				setLoading(false);
			}
		},
		[pickupService, userLocation, selectedWarehouse, handleError],
	);

	return {
		enabled,
		selectedWarehouse,
		warehouses,
		userLocation,
		loading,
		error,
		enablePickupMode,
		disablePickupMode,
		selectWarehouse,
		refreshWarehouses,
		clearError,
	};
}
