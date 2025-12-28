/**
 * Warehouse Selector Component
 *
 * Displays a list of nearby warehouses and allows user to select one
 */

import React from "react";
import type { WarehouseInfo } from "../types";

export interface WarehouseSelectorProps {
	warehouses: WarehouseInfo[];
	selectedWarehouseId: string | null;
	onSelect: (warehouse: WarehouseInfo) => void;
	loading?: boolean;
	className?: string;
	emptyMessage?: string;
}

export const WarehouseSelector: React.FC<WarehouseSelectorProps> = ({
	warehouses,
	selectedWarehouseId,
	onSelect,
	loading = false,
	className = "",
	emptyMessage = "No pickup locations found nearby",
}) => {
	if (loading) {
		return (
			<div className={`warehouse-selector loading ${className}`}>
				<div className="loading-spinner">Loading warehouses...</div>
			</div>
		);
	}

	if (warehouses.length === 0) {
		return (
			<div className={`warehouse-selector empty ${className}`}>
				<p>{emptyMessage}</p>
			</div>
		);
	}

	return (
		<div className={`warehouse-selector ${className}`}>
			<h3 className="warehouse-selector-title">Select Pickup Location</h3>
			<div className="warehouse-list">
				{warehouses.map((warehouse) => {
					const isSelected = warehouse.id === selectedWarehouseId;
					return (
						<div
							key={warehouse.id}
							className={`warehouse-item ${isSelected ? "selected" : ""}`}
							onClick={() => onSelect(warehouse)}
							role="button"
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									onSelect(warehouse);
								}
							}}
							aria-pressed={isSelected}
						>
							<div className="warehouse-header">
								<h4 className="warehouse-name">{warehouse.name}</h4>
								{isSelected && <span className="selected-badge">✓ Selected</span>}
							</div>

							{warehouse.address && <p className="warehouse-address">{warehouse.address}</p>}

							{warehouse.city && (
								<p className="warehouse-city">
									{warehouse.city}
									{warehouse.postal_code && `, ${warehouse.postal_code}`}
								</p>
							)}

							<div className="warehouse-footer">
								<span className="warehouse-distance">{warehouse.distance_km.toFixed(1)} km away</span>
								{warehouse.pickup_enabled && <span className="warehouse-status">Available</span>}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

// CSS Styles
export const warehouseSelectorStyles = `
.warehouse-selector {
  padding: 1.5rem;
}

.warehouse-selector-title {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.warehouse-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.warehouse-item {
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.warehouse-item:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
}

.warehouse-item.selected {
  border-color: #007bff;
  background: #f0f7ff;
}

.warehouse-item:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

.warehouse-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.warehouse-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.selected-badge {
  padding: 0.25rem 0.75rem;
  background: #007bff;
  color: white;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.warehouse-address {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #666;
}

.warehouse-city {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #666;
}

.warehouse-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e0e0e0;
}

.warehouse-distance {
  font-size: 0.875rem;
  font-weight: 500;
  color: #007bff;
}

.warehouse-status {
  padding: 0.25rem 0.5rem;
  background: #28a745;
  color: white;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.warehouse-selector.loading,
.warehouse-selector.empty {
  padding: 2rem;
  text-align: center;
  color: #666;
}

.loading-spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;
