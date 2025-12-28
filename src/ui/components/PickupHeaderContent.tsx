/**
 * Pickup Header Content Component
 * 
 * Client component that handles Click & Collect toggle and modal
 * Separated to avoid issues with usePickupMode hook
 */

"use client";

import { useState, useMemo, useEffect } from "react";
import { ClickCollectToggle, usePickupMode, PickupModeModal, PickupServiceClient } from "../../pickup-service";

export function PickupHeaderContent() {
	const [modalOpen, setModalOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	// Ensure component only renders on client to avoid hydration mismatch
	useEffect(() => {
		// Use setTimeout to avoid setState in effect warning
		const timer = setTimeout(() => {
			setMounted(true);
		}, 0);
		return () => clearTimeout(timer);
	}, []);

	// Initialize pickup service client-side only
	const pickupService = useMemo(() => {
		// Only initialize on client
		if (typeof window === 'undefined') {
			return null;
		}

		const pickupServiceUrl = process.env.NEXT_PUBLIC_PICKUP_SERVICE_URL;
		const channelSlug = process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || 'default-channel';
		
		if (!pickupServiceUrl) {
			return null;
		}

		return new PickupServiceClient({
			baseUrl: pickupServiceUrl,
			channelSlug,
			defaultRadiusKm: 25,
		});
	}, []);

	// Create a dummy pickup service if not available (hooks must be called unconditionally)
	const dummyPickupService = useMemo(() => {
		if (!pickupService) {
			// Return a minimal dummy service that won't be used
			return {
				discoverWarehouses: async () => [],
				selectWarehouse: async () => {},
				getProducts: async () => ({}),
				getProductsByLocation: async () => ({}),
				healthCheck: async () => ({ status: 'ok', service: 'dummy' }),
			} as PickupServiceClient;
		}
		return pickupService;
	}, [pickupService]);

	// Always call the hook (React rules), but only use it if service is available
	const {
		enabled,
		selectedWarehouse,
		disablePickupMode,
		loading,
	} = usePickupMode({
		pickupService: dummyPickupService,
		autoLoadStored: true,
	});

	// Don't render anything during SSR or if service is not configured
	if (!mounted || !pickupService) {
		// Debug: Log why component is not rendering
		if (typeof window !== 'undefined' && !pickupService) {
			console.warn('[PickupHeaderContent] Not rendering:', {
				mounted,
				hasPickupServiceUrl: !!process.env.NEXT_PUBLIC_PICKUP_SERVICE_URL,
				pickupServiceUrl: process.env.NEXT_PUBLIC_PICKUP_SERVICE_URL,
			});
		}
		return null;
	}

	return (
		<>
			<ClickCollectToggle
				enabled={enabled}
				onToggle={() => {
					if (enabled) {
						disablePickupMode();
					} else {
						setModalOpen(true);
					}
				}}
				loading={loading}
				className="text-sm"
			/>
			{selectedWarehouse && (
				<span className="text-xs text-neutral-600 hidden sm:inline">
					📍 {selectedWarehouse.name}
				</span>
			)}
			<PickupModeModal
				pickupServiceOptions={{
					pickupService,
					autoLoadStored: true,
				}}
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				geocodingApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
			/>
		</>
	);
}

