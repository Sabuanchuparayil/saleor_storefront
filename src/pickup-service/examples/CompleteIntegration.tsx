/**
 * Complete Integration Example
 *
 * This example shows how to integrate all Click & Collect components
 * into a typical storefront application.
 */

import React, { useState, useEffect } from "react";
import { ClickCollectToggle, PickupModeModal, usePickupMode, PickupServiceClient } from "../index";

// Initialize pickup service client
const pickupService = new PickupServiceClient({
	baseUrl: process.env.NEXT_PUBLIC_PICKUP_SERVICE_URL || "https://pickup-service-production.up.railway.app",
	channelSlug: process.env.NEXT_PUBLIC_CHANNEL_SLUG || "default-channel",
	defaultRadiusKm: 25,
});

export function CompleteIntegrationExample() {
	const [modalOpen, setModalOpen] = useState(false);
	const [products, setProducts] = useState<any[]>([]);
	const [loadingProducts, setLoadingProducts] = useState(false);

	const { enabled, selectedWarehouse, loading, error, enablePickupMode, disablePickupMode, selectWarehouse } =
		usePickupMode({
			pickupService,
			autoLoadStored: true,
			onWarehouseSelected: (warehouse) => {
				console.log("Warehouse selected:", warehouse);
				// Refresh products when warehouse is selected
				fetchProducts();
			},
			onError: (err) => {
				console.error("Pickup mode error:", err);
			},
		});

	// Fetch products based on mode
	const fetchProducts = async () => {
		setLoadingProducts(true);
		try {
			if (enabled && selectedWarehouse) {
				// Use pickup service
				const data = await pickupService.getProducts(selectedWarehouse.id, { search: "" }, { first: 20 });
				setProducts(data.products || []);
			} else {
				// Use regular Saleor GraphQL
				// Replace with your actual Saleor GraphQL query
				const response = await fetch("/api/products");
				const data = await response.json();
				setProducts(data.products || []);
			}
		} catch (err) {
			console.error("Failed to fetch products:", err);
		} finally {
			setLoadingProducts(false);
		}
	};

	// Fetch products when mode changes
	useEffect(() => {
		fetchProducts();
	}, [enabled, selectedWarehouse]);

	return (
		<div className="app">
			{/* Header with Toggle */}
			<header className="header">
				<div className="header-content">
					<h1>My Store</h1>
					<div className="header-actions">
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
						/>
						{selectedWarehouse && (
							<div className="selected-warehouse-info">
								<span>📍 {selectedWarehouse.name}</span>
								<span className="distance">{selectedWarehouse.distance_km.toFixed(1)} km</span>
							</div>
						)}
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="main">
				{error && (
					<div className="error-banner">
						{error}
						<button onClick={() => setModalOpen(true)}>Try Again</button>
					</div>
				)}

				{/* Product Listing */}
				<div className="products-section">
					<h2>
						{enabled && selectedWarehouse
							? `Products Available at ${selectedWarehouse.name}`
							: "All Products"}
					</h2>

					{loadingProducts ? (
						<div className="loading">Loading products...</div>
					) : (
						<div className="products-grid">
							{products.map((product) => (
								<div key={product.id} className="product-card">
									<h3>{product.name}</h3>
									<p>{product.description}</p>
									{/* Add more product details */}
								</div>
							))}
						</div>
					)}
				</div>
			</main>

			{/* Pickup Mode Modal */}
			<PickupModeModal
				pickupServiceOptions={{
					pickupService,
					autoLoadStored: true,
				}}
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				onWarehouseSelected={(warehouse) => {
					console.log("Warehouse selected in modal:", warehouse);
					setModalOpen(false);
				}}
				geocodingApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
			/>
		</div>
	);
}

// Example CSS (add to your stylesheet)
const exampleStyles = `
.app {
  min-height: 100vh;
}

.header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.selected-warehouse-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f0f7ff;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.distance {
  color: #007bff;
  font-weight: 500;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.error-banner {
  padding: 1rem;
  background: #f8d7da;
  color: #721c24;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.products-section h2 {
  margin-bottom: 1.5rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.product-card {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  background: white;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}
`;

export default CompleteIntegrationExample;
