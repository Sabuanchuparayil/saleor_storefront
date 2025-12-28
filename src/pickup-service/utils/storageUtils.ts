/**
 * Storage utilities for Click & Collect state persistence
 */

import type { WarehouseInfo } from "../types";

const STORAGE_KEY_WAREHOUSE = "pickup_warehouse_id";
const STORAGE_KEY_WAREHOUSE_DATA = "pickup_warehouse_data";
const STORAGE_KEY_PICKUP_MODE = "pickup_mode_enabled";

/**
 * Store selected warehouse ID
 */
export function storeWarehouse(warehouseId: string): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY_WAREHOUSE, warehouseId);
	} catch (error) {
		console.warn("Failed to store warehouse:", error);
	}
}

/**
 * Get stored warehouse ID
 */
export function getStoredWarehouse(): string | null {
	if (typeof window === "undefined") return null;
	try {
		return localStorage.getItem(STORAGE_KEY_WAREHOUSE);
	} catch (error) {
		console.warn("Failed to retrieve stored warehouse:", error);
		return null;
	}
}

/**
 * Store warehouse data (full object)
 */
export function storeWarehouseData(warehouse: WarehouseInfo): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY_WAREHOUSE_DATA, JSON.stringify(warehouse));
	} catch (error) {
		console.warn("Failed to store warehouse data:", error);
	}
}

/**
 * Get stored warehouse data
 */
export function getStoredWarehouseData(): WarehouseInfo | null {
	if (typeof window === "undefined") return null;
	try {
		const stored = localStorage.getItem(STORAGE_KEY_WAREHOUSE_DATA);
		return stored ? (JSON.parse(stored) as WarehouseInfo) : null;
	} catch (error) {
		console.warn("Failed to retrieve stored warehouse data:", error);
		return null;
	}
}

/**
 * Clear stored warehouse
 */
export function clearWarehouse(): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.removeItem(STORAGE_KEY_WAREHOUSE);
		localStorage.removeItem(STORAGE_KEY_WAREHOUSE_DATA);
	} catch (error) {
		console.warn("Failed to clear warehouse:", error);
	}
}

/**
 * Store pickup mode enabled state
 */
export function storePickupMode(enabled: boolean): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY_PICKUP_MODE, enabled ? "true" : "false");
	} catch (error) {
		console.warn("Failed to store pickup mode:", error);
	}
}

/**
 * Get stored pickup mode state
 */
export function getStoredPickupMode(): boolean {
	if (typeof window === "undefined") return false;
	try {
		return localStorage.getItem(STORAGE_KEY_PICKUP_MODE) === "true";
	} catch (error) {
		console.warn("Failed to retrieve pickup mode:", error);
		return false;
	}
}

/**
 * Clear all pickup-related storage
 */
export function clearAllPickupStorage(): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.removeItem(STORAGE_KEY_WAREHOUSE);
		localStorage.removeItem(STORAGE_KEY_WAREHOUSE_DATA);
		localStorage.removeItem(STORAGE_KEY_PICKUP_MODE);
	} catch (error) {
		console.warn("Failed to clear pickup storage:", error);
	}
}
