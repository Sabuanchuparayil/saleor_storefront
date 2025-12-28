/**
 * Pickup Service Client Initialization
 *
 * Creates and exports the pickup service client instance
 */

import { PickupServiceClient } from "../pickup-service";

const pickupServiceUrl = process.env.NEXT_PUBLIC_PICKUP_SERVICE_URL;
const channelSlug = process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "default-channel";

if (!pickupServiceUrl) {
	console.warn("⚠️ NEXT_PUBLIC_PICKUP_SERVICE_URL is not set. Click & Collect features will not work.");
}

export const pickupService = pickupServiceUrl
	? new PickupServiceClient({
			baseUrl: pickupServiceUrl,
			channelSlug,
			defaultRadiusKm: 25,
		})
	: null;
