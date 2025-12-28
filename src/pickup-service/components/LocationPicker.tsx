/**
 * Location Picker Component
 *
 * Component for capturing user location via geolocation or address input
 */

import React, { useState, useCallback } from "react";
import type { Location } from "../types";
import { getCurrentLocation, geocodeAddress } from "../utils/locationUtils";

export interface LocationPickerProps {
	onLocationSelected: (location: Location) => void;
	onError?: (error: Error) => void;
	showAddressInput?: boolean;
	geocodingApiKey?: string;
	className?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
	onLocationSelected,
	onError,
	showAddressInput = true,
	geocodingApiKey,
	className = "",
}) => {
	const [loading, setLoading] = useState(false);
	const [address, setAddress] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleGetCurrentLocation = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const location = await getCurrentLocation();
			onLocationSelected(location);
		} catch (err) {
			const error = err instanceof Error ? err : new Error("Failed to get location");
			setError(error.message);
			if (onError) {
				onError(error);
			}
		} finally {
			setLoading(false);
		}
	}, [onLocationSelected, onError]);

	const handleAddressSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			if (!address.trim()) return;

			if (!geocodingApiKey) {
				setError(
					'Address geocoding is not configured. Please use "Use My Location" button instead, or configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.',
				);
				return;
			}

			setLoading(true);
			setError(null);

			try {
				const location = await geocodeAddress(address, geocodingApiKey);
				onLocationSelected(location);
				setAddress("");
			} catch (err) {
				const error = err instanceof Error ? err : new Error("Failed to geocode address");
				setError(error.message);
				if (onError) {
					onError(error);
				}
			} finally {
				setLoading(false);
			}
		},
		[address, geocodingApiKey, onLocationSelected, onError],
	);

	return (
		<div className={`location-picker ${className}`}>
			<div className="location-picker-options">
				<button
					type="button"
					onClick={handleGetCurrentLocation}
					disabled={loading}
					className="location-button"
				>
					{loading ? "Getting location..." : "📍 Use My Location"}
				</button>

				{showAddressInput && (
					<>
						{!geocodingApiKey && (
							<div className="geocoding-warning" role="alert">
								<p className="warning-text">
									⚠️ Address search is not available. Please use &quot;Use My Location&quot; button or
									configure Google Maps API key.
								</p>
							</div>
						)}
						<form onSubmit={handleAddressSubmit} className="address-form">
							<input
								type="text"
								value={address}
								onChange={(e) => setAddress(e.target.value)}
								placeholder={
									geocodingApiKey ? "Enter your address" : "Address search unavailable (use location button)"
								}
								disabled={loading || !geocodingApiKey}
								className="address-input"
							/>
							<button type="submit" disabled={loading || !address.trim() || !geocodingApiKey}>
								Search
							</button>
						</form>
					</>
				)}
			</div>

			{error && (
				<div className="error-message" role="alert">
					{error}
				</div>
			)}

			<p className="location-privacy">
				Your location is only used to find nearby pickup locations and is not stored.
			</p>
		</div>
	);
};

// CSS Styles
export const locationPickerStyles = `
.location-picker {
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  background: white;
}

.location-picker-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.location-button {
  padding: 0.75rem 1.25rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.location-button:hover:not(:disabled) {
  background: #0056b3;
}

.location-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.address-form {
  display: flex;
  gap: 0.5rem;
}

.address-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.address-input:focus {
  outline: none;
  border-color: #007bff;
}

.address-form button {
  padding: 0.75rem 1.5rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.address-form button:hover:not(:disabled) {
  background: #218838;
}

.address-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #f8d7da;
  color: #721c24;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.location-privacy {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #6c757d;
  text-align: center;
}

.geocoding-warning {
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 0.5rem;
}

.warning-text {
  margin: 0;
  font-size: 0.875rem;
  color: #856404;
  line-height: 1.4;
}
`;
