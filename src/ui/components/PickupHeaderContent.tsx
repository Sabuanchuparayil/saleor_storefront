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

		// #region agent log
		fetch('http://127.0.0.1:7243/ingest/45b3a70a-4b28-4eaa-b1ed-5a2ad1f28c3e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PickupHeaderContent.tsx:33',message:'Reading env vars',data:{allNextPublicVars:Object.keys(process.env).filter(k=>k.startsWith('NEXT_PUBLIC_')).reduce((acc:Record<string,string|undefined>,k)=>{acc[k]=process.env[k];return acc;},{})},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
		// #endregion

		const pickupServiceUrl = process.env.NEXT_PUBLIC_PICKUP_SERVICE_URL;
		const channelSlug = process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || 'default-channel';
		
		// #region agent log
		fetch('http://127.0.0.1:7243/ingest/45b3a70a-4b28-4eaa-b1ed-5a2ad1f28c3e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PickupHeaderContent.tsx:40',message:'Env var values after read',data:{pickupServiceUrl,channelSlug,hasPickupServiceUrl:!!pickupServiceUrl,typeOfPickupServiceUrl:typeof pickupServiceUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
		// #endregion
		
		if (!pickupServiceUrl) {
			// #region agent log
			fetch('http://127.0.0.1:7243/ingest/45b3a70a-4b28-4eaa-b1ed-5a2ad1f28c3e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PickupHeaderContent.tsx:46',message:'pickupServiceUrl is falsy',data:{pickupServiceUrl,channelSlug},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
			// #endregion
			return null;
		}

		// #region agent log
		fetch('http://127.0.0.1:7243/ingest/45b3a70a-4b28-4eaa-b1ed-5a2ad1f28c3e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PickupHeaderContent.tsx:50',message:'Creating PickupServiceClient',data:{pickupServiceUrl,channelSlug},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
		// #endregion

		return new PickupServiceClient({
			baseUrl: pickupServiceUrl,
			channelSlug,
			defaultRadiusKm: 25,
		});
	}, []);

	// Create a dummy pickup service if not available (hooks must be called unconditionally)
	const dummyPickupService = useMemo(() => {
		if (!pickupService) {
			// Return a minimal dummy service that matches PickupServiceClient type
			// This won't be used since we return null early, but satisfies React hooks rules
			// Using 'as unknown as' because PickupServiceClient has private properties
			return {
				discoverWarehouses: async () => [],
				selectWarehouse: async () => {},
				getProducts: async () => ({}),
				getProductsByLocation: async () => ({}),
				healthCheck: async () => ({ status: 'ok', service: 'dummy' }),
			} as unknown as PickupServiceClient;
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

