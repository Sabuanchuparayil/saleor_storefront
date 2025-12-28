/**
 * Checkout Integration Example
 *
 * Shows how to integrate Click & Collect with Saleor checkout
 */

import React, { useState } from "react";
import { usePickupMode } from "../hooks/usePickupMode";
import { PickupServiceClient } from "../utils/pickupServiceClient";
import {
	buildClickCollectCheckoutInput,
	CREATE_CHECKOUT_WITH_PICKUP,
	isClickAndCollectCheckout,
} from "../utils/checkoutIntegration";
import { useMutation } from "@apollo/client";

const pickupService = new PickupServiceClient({
	baseUrl: process.env.NEXT_PUBLIC_PICKUP_SERVICE_URL!,
	channelSlug: process.env.NEXT_PUBLIC_CHANNEL_SLUG!,
});

export function CheckoutIntegrationExample() {
	const { enabled, selectedWarehouse } = usePickupMode({
		pickupService,
		autoLoadStored: true,
	});

	const [createCheckout, { loading, error }] = useMutation(CREATE_CHECKOUT_WITH_PICKUP);
	const [checkout, setCheckout] = useState<any>(null);

	const handleCheckout = async (cartItems: Array<{ variantId: string; quantity: number }>) => {
		if (!enabled || !selectedWarehouse) {
			// Regular checkout without Click & Collect
			const input = {
				channel: process.env.NEXT_PUBLIC_CHANNEL_SLUG,
				lines: cartItems,
			};

			const { data } = await createCheckout({
				variables: { input },
			});

			setCheckout(data.checkoutCreate.checkout);
			return;
		}

		// Click & Collect checkout
		const input = buildClickCollectCheckoutInput(
			process.env.NEXT_PUBLIC_CHANNEL_SLUG!,
			cartItems,
			selectedWarehouse,
			"customer@example.com", // Get from form
			{
				firstName: "John",
				lastName: "Doe",
				streetAddress1: "123 Main St",
				city: "City",
				postalCode: "12345",
				country: "US",
			},
		);

		try {
			const { data } = await createCheckout({
				variables: { input },
			});

			if (data.checkoutCreate.errors?.length > 0) {
				console.error("Checkout errors:", data.checkoutCreate.errors);
				return;
			}

			const createdCheckout = data.checkoutCreate.checkout;
			setCheckout(createdCheckout);

			// Verify it's Click & Collect
			if (isClickAndCollectCheckout(createdCheckout)) {
				console.log("Click & Collect checkout created successfully!");
				console.log("Pickup at:", createdCheckout.deliveryMethod.name);
			}
		} catch (err) {
			console.error("Failed to create checkout:", err);
		}
	};

	return (
		<div className="checkout">
			{enabled && selectedWarehouse && (
				<div className="pickup-info">
					<h3>Pickup Information</h3>
					<p>
						<strong>Location:</strong> {selectedWarehouse.name}
					</p>
					<p>
						<strong>Address:</strong> {selectedWarehouse.address}
					</p>
					{selectedWarehouse.city && (
						<p>
							<strong>City:</strong> {selectedWarehouse.city}
						</p>
					)}
					<p>
						<strong>Distance:</strong> {selectedWarehouse.distance_km.toFixed(1)} km
					</p>
				</div>
			)}

			{checkout && (
				<div className="checkout-summary">
					<h3>Checkout Summary</h3>
					{isClickAndCollectCheckout(checkout) ? (
						<div className="pickup-confirmation">
							<p>✓ Click & Collect order</p>
							<p>Pickup at: {checkout.deliveryMethod.name}</p>
						</div>
					) : (
						<p>Regular delivery order</p>
					)}
				</div>
			)}

			{error && <div className="error">Error: {error.message}</div>}
		</div>
	);
}
