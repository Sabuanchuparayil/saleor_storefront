/**
 * Click & Collect Frontend Integration Package
 *
 * Main export file for all components, hooks, and utilities
 */

// Components
export { ClickCollectToggle } from "./components/ClickCollectToggle";
export type { ClickCollectToggleProps } from "./components/ClickCollectToggle";

export { LocationPicker } from "./components/LocationPicker";
export type { LocationPickerProps } from "./components/LocationPicker";

export { WarehouseSelector } from "./components/WarehouseSelector";
export type { WarehouseSelectorProps } from "./components/WarehouseSelector";

export { PickupModeModal } from "./components/PickupModeModal";
export type { PickupModeModalProps } from "./components/PickupModeModal";

// Hooks
export { usePickupMode } from "./hooks/usePickupMode";
export type { UsePickupModeOptions, UsePickupModeReturn } from "./hooks/usePickupMode";

// Utilities
export { PickupServiceClient } from "./utils/pickupServiceClient";
export type { PickupServiceClientConfig } from "./utils/pickupServiceClient";

export * from "./utils/locationUtils";
export * from "./utils/storageUtils";

// Types
export * from "./types";

// Styles
export { clickCollectToggleStyles } from "./components/ClickCollectToggle";
export { locationPickerStyles } from "./components/LocationPicker";
export { warehouseSelectorStyles } from "./components/WarehouseSelector";
export { pickupModeModalStyles } from "./components/PickupModeModal";
