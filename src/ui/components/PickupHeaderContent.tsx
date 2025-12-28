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

	// Only use the hook if service is available and component is mounted
	const {
		enabled,
		selectedWarehouse,
		enablePickupMode,
		disablePickupMode,
		loading,
	} = usePickupMode({
		pickupService: pickupService!,
		autoLoadStored: true,
	});

	// Don't render anything during SSR or if service is not configured
	if (!mounted || !pickupService) {
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

