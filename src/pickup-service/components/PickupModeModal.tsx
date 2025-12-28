/**
 * Pickup Mode Modal Component
 *
 * Complete modal for enabling Click & Collect mode with location and warehouse selection
 */

import React, { useState } from "react";
import type { Location, WarehouseInfo } from "../types";
import { LocationPicker } from "./LocationPicker";
import { WarehouseSelector } from "./WarehouseSelector";
import { usePickupMode, UsePickupModeOptions } from "../hooks/usePickupMode";

export interface PickupModeModalProps {
	pickupServiceOptions: Omit<UsePickupModeOptions, "pickupService"> & {
		pickupService: any; // PickupServiceClient instance
	};
	isOpen: boolean;
	onClose: () => void;
	onWarehouseSelected?: (warehouse: WarehouseInfo) => void;
	geocodingApiKey?: string;
	className?: string;
}

export const PickupModeModal: React.FC<PickupModeModalProps> = ({
	pickupServiceOptions,
	isOpen,
	onClose,
	onWarehouseSelected,
	geocodingApiKey,
	className = "",
}) => {
	const [step, setStep] = useState<"location" | "warehouse">("location");

	const {
		warehouses,
		selectedWarehouse,
		loading,
		error,
		enablePickupMode,
		selectWarehouse,
		clearError,
	} = usePickupMode({
		...pickupServiceOptions,
		onWarehouseSelected: (warehouse) => {
			if (onWarehouseSelected) {
				onWarehouseSelected(warehouse);
			}
			onClose();
		},
	});

	const handleLocationSelected = async (_location: Location) => {
		setStep("warehouse");

		// Enable pickup mode and discover warehouses
		try {
			await enablePickupMode();
		} catch {
			// Error is handled by the hook
		}
	};

	const handleWarehouseSelect = async (warehouse: WarehouseInfo) => {
		await selectWarehouse(warehouse);
	};

	const handleBack = () => {
		setStep("location");
		clearError();
	};

	if (!isOpen) return null;

	return (
		<div className={`pickup-modal-overlay ${className}`} onClick={onClose}>
			<div className="pickup-modal" onClick={(e) => e.stopPropagation()}>
				<div className="pickup-modal-header">
					<h2>Enable Click & Collect</h2>
					<button className="close-button" onClick={onClose} aria-label="Close">
						×
					</button>
				</div>

				<div className="pickup-modal-content">
					{step === "location" && (
						<div className="pickup-modal-step">
							<h3>Find Nearby Pickup Locations</h3>
							<p>We need your location to find the nearest pickup points.</p>
							<LocationPicker
								onLocationSelected={handleLocationSelected}
								onError={() => {
									// Error is displayed in LocationPicker
								}}
								showAddressInput={true}
								geocodingApiKey={geocodingApiKey}
							/>
						</div>
					)}

					{step === "warehouse" && (
						<div className="pickup-modal-step">
							<button className="back-button" onClick={handleBack}>
								← Back
							</button>
							<WarehouseSelector
								warehouses={warehouses}
								selectedWarehouseId={selectedWarehouse?.id || null}
								onSelect={handleWarehouseSelect}
								loading={loading}
								emptyMessage={error || "No pickup locations found nearby. Try a different location."}
							/>
						</div>
					)}

					{error && step === "warehouse" && (
						<div className="error-message" role="alert">
							{error}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

// CSS Styles
export const pickupModeModalStyles = `
.pickup-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.pickup-modal {
  background: white;
  border-radius: 0.5rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.pickup-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.pickup-modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  transition: background 0.2s;
}

.close-button:hover {
  background: #f0f0f0;
}

.pickup-modal-content {
  padding: 1.5rem;
}

.pickup-modal-step h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.pickup-modal-step p {
  margin: 0 0 1.5rem 0;
  color: #666;
  font-size: 0.875rem;
}

.back-button {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid #e0e0e0;
  border-radius: 0.25rem;
  color: #666;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.back-button:hover {
  background: #f0f0f0;
  border-color: #ccc;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #f8d7da;
  color: #721c24;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .pickup-modal {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
    max-height: 100vh;
  }
}
`;
