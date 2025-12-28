# Click & Collect Frontend Integration

Complete React/TypeScript components and utilities for integrating Click & Collect functionality into your storefront.

## Installation

Copy the `frontend` directory to your storefront project, or install as a package.

### For React/Next.js Projects

```bash
# Copy the frontend directory to your project
cp -r pickup_service/frontend ./src/pickup-service

# Or import directly
import { ClickCollectToggle, usePickupMode } from './pickup-service';
```

## Quick Start

### 1. Setup Pickup Service Client

```typescript
import { PickupServiceClient } from "./pickup-service/utils/pickupServiceClient";

const pickupService = new PickupServiceClient({
	baseUrl: "https://pickup-service-production.up.railway.app",
	channelSlug: "default-channel",
	defaultRadiusKm: 25,
});
```

### 2. Add Toggle Button to Header

```tsx
import { ClickCollectToggle } from "./pickup-service";
import { usePickupMode } from "./pickup-service";

function Header() {
	const { enabled, enablePickupMode, disablePickupMode, loading } = usePickupMode({
		pickupService,
		autoLoadStored: true,
	});

	return (
		<header>
			<ClickCollectToggle
				enabled={enabled}
				onToggle={() => (enabled ? disablePickupMode() : enablePickupMode())}
				loading={loading}
			/>
		</header>
	);
}
```

### 3. Add Warehouse Selection Modal

```tsx
import { PickupModeModal } from "./pickup-service";
import { useState } from "react";

function App() {
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<>
			<button onClick={() => setModalOpen(true)}>Enable Click & Collect</button>

			<PickupModeModal
				pickupServiceOptions={{
					pickupService,
					autoLoadStored: true,
				}}
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				onWarehouseSelected={(warehouse) => {
					console.log("Selected warehouse:", warehouse);
				}}
			/>
		</>
	);
}
```

### 4. Integrate with Product Listing

```tsx
import { usePickupMode } from "./pickup-service";
import { PickupServiceClient } from "./pickup-service/utils/pickupServiceClient";

function ProductListing() {
	const { enabled, selectedWarehouse } = usePickupMode({
		pickupService,
		autoLoadStored: true,
	});

	const fetchProducts = async () => {
		if (enabled && selectedWarehouse) {
			// Use pickup service
			const products = await pickupService.getProducts(
				selectedWarehouse.id,
				{ search: "laptop" },
				{ first: 20 },
			);
			return products;
		} else {
			// Use regular Saleor GraphQL
			return fetchSaleorProducts();
		}
	};

	// ... rest of component
}
```

## Components

### ClickCollectToggle

Toggle button for enabling/disabling Click & Collect mode.

```tsx
<ClickCollectToggle enabled={enabled} onToggle={handleToggle} loading={loading} />
```

### LocationPicker

Component for capturing user location via geolocation or address input.

```tsx
<LocationPicker
	onLocationSelected={(location) => console.log(location)}
	showAddressInput={true}
	geocodingApiKey="your-google-maps-api-key"
/>
```

### WarehouseSelector

Displays list of nearby warehouses for selection.

```tsx
<WarehouseSelector
	warehouses={warehouses}
	selectedWarehouseId={selectedId}
	onSelect={(warehouse) => handleSelect(warehouse)}
/>
```

### PickupModeModal

Complete modal with location capture and warehouse selection.

```tsx
<PickupModeModal pickupServiceOptions={{ pickupService }} isOpen={isOpen} onClose={() => setIsOpen(false)} />
```

## Hooks

### usePickupMode

Main hook for managing Click & Collect state.

```tsx
const {
	enabled,
	selectedWarehouse,
	warehouses,
	loading,
	error,
	enablePickupMode,
	disablePickupMode,
	selectWarehouse,
} = usePickupMode({
	pickupService,
	onError: (error) => console.error(error),
	onWarehouseSelected: (warehouse) => console.log(warehouse),
});
```

## Utilities

### PickupServiceClient

API client for interacting with the pickup service.

```typescript
const client = new PickupServiceClient({
	baseUrl: "https://pickup-service-production.up.railway.app",
	channelSlug: "default-channel",
});

// Discover warehouses
const warehouses = await client.discoverWarehouses(location);

// Get products
const products = await client.getProducts(warehouseId, filters, pagination);
```

### Location Utilities

```typescript
import { getCurrentLocation, geocodeAddress } from "./pickup-service/utils/locationUtils";

// Get current location
const location = await getCurrentLocation();

// Geocode address
const location = await geocodeAddress("123 Main St, City", apiKey);
```

### Storage Utilities

```typescript
import { storeWarehouse, getStoredWarehouse, clearWarehouse } from "./pickup-service/utils/storageUtils";

// Store warehouse
storeWarehouse(warehouseId);

// Get stored warehouse
const warehouseId = getStoredWarehouse();
```

## Styling

Import the CSS styles:

```tsx
import {
	clickCollectToggleStyles,
	locationPickerStyles,
	warehouseSelectorStyles,
	pickupModeModalStyles,
} from "./pickup-service";

// Add to your global stylesheet or component
<style>{`
  ${clickCollectToggleStyles}
  ${locationPickerStyles}
  ${warehouseSelectorStyles}
  ${pickupModeModalStyles}
`}</style>;
```

Or use CSS modules/styled-components to customize.

## Complete Example

See `examples/CompleteIntegration.tsx` for a full working example.

## API Reference

See the TypeScript types in `types/index.ts` for complete API documentation.

## Environment Variables

Set these in your storefront:

```env
NEXT_PUBLIC_PICKUP_SERVICE_URL=https://pickup-service-production.up.railway.app
NEXT_PUBLIC_CHANNEL_SLUG=default-channel
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key (optional, for address geocoding)
```

## Next Steps

1. ✅ Add toggle to header
2. ✅ Implement location capture
3. ✅ Add warehouse selection
4. ✅ Integrate with product listing
5. ✅ Update checkout to use selected warehouse

See `../docs/STOREFRONT_INTEGRATION.md` for detailed integration guide.
