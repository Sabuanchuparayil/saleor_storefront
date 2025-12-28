/**
 * Location utilities for geolocation and address handling
 */

import type { Location } from "../types";

const STORAGE_KEY_LOCATION = "pickup_user_location";

/**
 * Get current location using browser geolocation API
 */
export async function getCurrentLocation(): Promise<Location> {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			reject(new Error("Geolocation is not supported by this browser"));
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				resolve({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				});
			},
			(error) => {
				let message = "Failed to get location";
				switch (error.code) {
					case error.PERMISSION_DENIED:
						message = "Location permission denied by user";
						break;
					case error.POSITION_UNAVAILABLE:
						message = "Location information unavailable";
						break;
					case error.TIMEOUT:
						message = "Location request timed out";
						break;
				}
				reject(new Error(message));
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
			},
		);
	});
}

/**
 * Geocode an address to coordinates (requires Google Maps or similar service)
 */
export async function geocodeAddress(address: string, apiKey?: string): Promise<Location> {
	if (!apiKey) {
		throw new Error("Geocoding API key is required");
	}

	const response = await fetch(
		`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`,
	);

	if (!response.ok) {
		throw new Error("Geocoding request failed");
	}

	const data = await response.json();

	if (data.status !== "OK" || !data.results || data.results.length === 0) {
		throw new Error("Address not found");
	}

	const location = data.results[0].geometry.location;
	return {
		latitude: location.lat,
		longitude: location.lng,
	};
}

/**
 * Store location in localStorage (for session persistence)
 */
export function storeLocation(location: Location): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY_LOCATION, JSON.stringify(location));
	} catch (error) {
		console.warn("Failed to store location:", error);
	}
}

/**
 * Get stored location from localStorage
 */
export function getStoredLocation(): Location | null {
	if (typeof window === "undefined") return null;
	try {
		const stored = localStorage.getItem(STORAGE_KEY_LOCATION);
		return stored ? JSON.parse(stored) : null;
	} catch (error) {
		console.warn("Failed to retrieve stored location:", error);
		return null;
	}
}

/**
 * Clear stored location
 */
export function clearStoredLocation(): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.removeItem(STORAGE_KEY_LOCATION);
	} catch (error) {
		console.warn("Failed to clear stored location:", error);
	}
}

/**
 * Calculate distance between two points (Haversine formula)
 */
export function calculateDistance(point1: Location, point2: Location): number {
	const R = 6371; // Earth's radius in km
	const dLat = toRad(point2.latitude - point1.latitude);
	const dLon = toRad(point2.longitude - point1.longitude);
	const lat1 = toRad(point1.latitude);
	const lat2 = toRad(point2.latitude);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c;
}

function toRad(degrees: number): number {
	return (degrees * Math.PI) / 180;
}
