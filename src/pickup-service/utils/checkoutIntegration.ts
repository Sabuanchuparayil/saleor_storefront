/**
 * Checkout Integration Utilities
 *
 * Utilities for integrating Click & Collect with Saleor checkout
 */

import type { WarehouseInfo } from "../types";

/**
 * Create checkout input with Click & Collect warehouse
 */
export interface CheckoutCreateInput {
	channel: string;
	lines: Array<{
		variantId: string;
		quantity: number;
	}>;
	email?: string;
	deliveryMethod?: {
		warehouseId?: string;
	};
	shippingAddress?: {
		firstName?: string;
		lastName?: string;
		streetAddress1?: string;
		streetAddress2?: string;
		city?: string;
		postalCode?: string;
		country: string;
	};
	billingAddress?: {
		firstName?: string;
		lastName?: string;
		streetAddress1?: string;
		streetAddress2?: string;
		city?: string;
		postalCode?: string;
		country: string;
	};
}

/**
 * Build checkout input for Click & Collect
 */
export function buildClickCollectCheckoutInput(
	channelSlug: string,
	lines: Array<{ variantId: string; quantity: number }>,
	warehouse: WarehouseInfo,
	email?: string,
	billingAddress?: CheckoutCreateInput["billingAddress"],
): CheckoutCreateInput {
	return {
		channel: channelSlug,
		lines,
		...(email && { email }),
		deliveryMethod: {
			warehouseId: warehouse.id,
		},
		// For Click & Collect, shipping address can be the warehouse address
		// or customer's address if they want it shipped to warehouse
		...(billingAddress && { billingAddress }),
	};
}

/**
 * GraphQL mutation for creating checkout with Click & Collect
 */
export const CREATE_CHECKOUT_WITH_PICKUP = `
  mutation CreateCheckout($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        token
        email
        lines {
          id
          quantity
          variant {
            id
            name
            product {
              id
              name
            }
          }
        }
        deliveryMethod {
          ... on Warehouse {
            id
            name
            address {
              streetAddress1
              city
              postalCode
              country {
                code
              }
            }
          }
        }
        totalPrice {
          gross {
            amount
            currency
          }
        }
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

/**
 * GraphQL mutation for setting delivery method (warehouse)
 */
export const SET_DELIVERY_METHOD = `
  mutation SetDeliveryMethod($checkoutId: ID!, $deliveryMethodId: ID!) {
    checkoutDeliveryMethodUpdate(
      checkoutId: $checkoutId
      deliveryMethodId: $deliveryMethodId
    ) {
      checkout {
        id
        deliveryMethod {
          ... on Warehouse {
            id
            name
            address {
              streetAddress1
              city
              postalCode
            }
          }
        }
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

/**
 * Helper to check if checkout is Click & Collect
 */
export function isClickAndCollectCheckout(checkout: any): boolean {
	return (
		checkout?.deliveryMethod?.__typename === "Warehouse" ||
		checkout?.collectionPoint !== null ||
		checkout?.collectionPointName !== null
	);
}

/**
 * Get warehouse info from checkout
 */
export function getWarehouseFromCheckout(checkout: any): WarehouseInfo | null {
	if (!isClickAndCollectCheckout(checkout)) {
		return null;
	}

	const warehouse = checkout.deliveryMethod;
	if (!warehouse) {
		return null;
	}

	return {
		id: warehouse.id,
		name: warehouse.name,
		address: warehouse.address?.streetAddress1,
		city: warehouse.address?.city,
		postal_code: warehouse.address?.postalCode,
		country: warehouse.address?.country?.code,
		distance_km: 0, // Not available in checkout
		pickup_enabled: true,
	};
}
