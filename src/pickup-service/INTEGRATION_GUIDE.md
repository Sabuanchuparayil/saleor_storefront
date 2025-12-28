# Complete Frontend Integration Guide

This guide walks you through integrating Click & Collect functionality into your storefront step by step.

## Prerequisites

- React/Next.js storefront (or compatible framework)
- Pickup service deployed and accessible
- Channel slug from your Saleor instance

## Step 1: Copy Frontend Package

Copy the `frontend` directory to your storefront project:

```bash
# From your storefront project root
cp -r /path/to/pickup_service/frontend ./src/pickup-service
```

## Step 2: Install Dependencies

The components use React hooks. Ensure you have React 16.8+ installed.

```bash
npm install react react-dom
# or
yarn add react react-dom
```

## Step 3: Setup Environment Variables

Add to your `.env.local` or environment configuration:

```env
NEXT_PUBLIC_PICKUP_SERVICE_URL=https://pickup-service-production.up.railway.app
NEXT_PUBLIC_CHANNEL_SLUG=default-channel
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key (optional)
```

## Step 4: Initialize Pickup Service Client

Create a service instance file:

```typescript
// src/services/pickupService.ts
import { PickupServiceClient } from "../pickup-service";

export const pickupService = new PickupServiceClient({
	baseUrl: process.env.NEXT_PUBLIC_PICKUP_SERVICE_URL!,
	channelSlug: process.env.NEXT_PUBLIC_CHANNEL_SLUG!,
	defaultRadiusKm: 25,
});
```

## Step 5: Add Toggle to Header

Update your header component:

```tsx
// components/Header.tsx
import { ClickCollectToggle } from "../pickup-service";
import { usePickupMode } from "../pickup-service";
import { pickupService } from "../services/pickupService";

export function Header() {
	const { enabled, selectedWarehouse, enablePickupMode, disablePickupMode, loading } = usePickupMode({
		pickupService,
		autoLoadStored: true,
	});

	return (
		<header>
			<nav>{/* Your existing navigation */}</nav>
			<ClickCollectToggle
				enabled={enabled}
				onToggle={() => (enabled ? disablePickupMode() : enablePickupMode())}
				loading={loading}
			/>
			{selectedWarehouse && <span>📍 {selectedWarehouse.name}</span>}
		</header>
	);
}
```

## Step 6: Add Modal for Warehouse Selection

Create a modal component or add to your layout:

```tsx
// components/PickupModal.tsx
import { PickupModeModal } from "../pickup-service";
import { pickupService } from "../services/pickupService";

export function PickupModal({ isOpen, onClose }) {
	return (
		<PickupModeModal
			pickupServiceOptions={{
				pickupService,
				autoLoadStored: true,
			}}
			isOpen={isOpen}
			onClose={onClose}
			geocodingApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
		/>
	);
}
```

## Step 7: Integrate with Product Listing

Update your product listing component:

```tsx
// components/ProductListing.tsx
import { usePickupMode } from "../pickup-service";
import { pickupService } from "../services/pickupService";
import { useEffect, useState } from "react";

export function ProductListing() {
	const { enabled, selectedWarehouse } = usePickupMode({
		pickupService,
		autoLoadStored: true,
	});

	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchProducts();
	}, [enabled, selectedWarehouse]);

	const fetchProducts = async () => {
		setLoading(true);
		try {
			if (enabled && selectedWarehouse) {
				// Use pickup service
				const data = await pickupService.getProducts(selectedWarehouse.id, {}, { first: 20 });
				setProducts(data.products || []);
			} else {
				// Use regular Saleor GraphQL
				const response = await fetch("/api/products");
				const data = await response.json();
				setProducts(data.products || []);
			}
		} catch (error) {
			console.error("Failed to fetch products:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			{loading ? (
				<div>Loading...</div>
			) : (
				<div className="products-grid">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			)}
		</div>
	);
}
```

## Step 8: Update Checkout

When creating checkout, pass the selected warehouse:

```tsx
// components/Checkout.tsx
import { usePickupMode } from "../pickup-service";
import { useMutation } from "@apollo/client";
import { CREATE_CHECKOUT } from "../graphql/mutations";

export function Checkout() {
	const { selectedWarehouse } = usePickupMode({
		pickupService,
		autoLoadStored: true,
	});

	const [createCheckout] = useMutation(CREATE_CHECKOUT);

	const handleCheckout = async (lines) => {
		const input = {
			channel: process.env.NEXT_PUBLIC_CHANNEL_SLUG,
			lines,
			// For Click & Collect
			...(selectedWarehouse && {
				deliveryMethod: {
					warehouseId: selectedWarehouse.id,
				},
			}),
		};

		const { data } = await createCheckout({ variables: { input } });
		// Handle checkout creation
	};

	return (
		<div>
			{selectedWarehouse && (
				<div className="pickup-info">
					<p>Pickup at: {selectedWarehouse.name}</p>
					<p>{selectedWarehouse.address}</p>
				</div>
			)}
			{/* Rest of checkout form */}
		</div>
	);
}
```

## Step 9: Add Styles

Import the component styles:

```tsx
// styles/pickup-service.css
import {
	clickCollectToggleStyles,
	locationPickerStyles,
	warehouseSelectorStyles,
	pickupModeModalStyles,
} from "../pickup-service";

// Add to your global CSS or component
```

Or add to your global stylesheet:

```css
/* styles/globals.css */
@import "../pickup-service/components/ClickCollectToggle.css";
@import "../pickup-service/components/LocationPicker.css";
@import "../pickup-service/components/WarehouseSelector.css";
@import "../pickup-service/components/PickupModeModal.css";
```

## Step 10: Test Integration

1. **Test Toggle**: Click the toggle button, verify modal opens
2. **Test Location**: Allow location access, verify warehouses appear
3. **Test Selection**: Select a warehouse, verify it's stored
4. **Test Products**: Verify products update when warehouse is selected
5. **Test Persistence**: Refresh page, verify warehouse is remembered

## Troubleshooting

### Modal doesn't open

- Check `isOpen` prop is being set correctly
- Verify pickup service URL is correct
- Check browser console for errors

### No warehouses found

- Verify warehouses have coordinates set in Saleor
- Check radius is appropriate (try increasing)
- Verify channel slug matches your Saleor channel

### Products don't update

- Check `enabled` and `selectedWarehouse` state
- Verify pickup service API is accessible
- Check browser network tab for API errors

### Location permission denied

- User needs to grant location permission
- Fallback to address input if geolocation fails

## Next Steps

1. ✅ Customize styling to match your brand
2. ✅ Add loading states and error handling
3. ✅ Implement product search/filtering
4. ✅ Add warehouse details page
5. ✅ Integrate with checkout flow

## Support

See `../docs/STOREFRONT_INTEGRATION.md` for detailed API documentation.
