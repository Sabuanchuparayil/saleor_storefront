/**
 * Product List Component with Click & Collect Support
 *
 * This component wraps ProductList and integrates with pickup service
 * when Click & Collect mode is enabled.
 */

"use client";

import { useEffect, useState } from "react";
import { ProductList } from "./ProductList";
import { usePickupMode } from "../../pickup-service";
import { pickupService } from "../../lib/pickupService";
import type { ProductListItemFragment } from "@/gql/graphql";

interface PickupProductListProps {
	initialProducts: readonly ProductListItemFragment[];
	channel: string;
	collectionSlug?: string;
	categorySlug?: string;
	searchQuery?: string;
}

export function PickupProductList({
	initialProducts,
	channel,
	collectionSlug,
	categorySlug,
	searchQuery,
}: PickupProductListProps) {
	const { enabled, selectedWarehouse } = usePickupMode({
		pickupService: pickupService!,
		autoLoadStored: true,
	});

	const [products, setProducts] = useState(initialProducts);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchProducts = async () => {
			if (!enabled || !selectedWarehouse || !pickupService) {
				// Use regular products when pickup mode is disabled
				setProducts(initialProducts);
				return;
			}

			setLoading(true);
			try {
				const filters: any = {};
				if (searchQuery) filters.search = searchQuery;
				if (collectionSlug) filters.collections = [collectionSlug];
				if (categorySlug) filters.categories = [categorySlug];

				const data = await pickupService.getProducts(selectedWarehouse.id, filters, { first: 20 });

				// Transform pickup service products to match ProductListItemFragment format
				// Note: You may need to adjust this based on the actual API response structure
				if (data.products) {
					setProducts(data.products as any);
				} else {
					setProducts(initialProducts);
				}
			} catch (error) {
				console.error("Failed to fetch pickup products:", error);
				// Fallback to regular products on error
				setProducts(initialProducts);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, [enabled, selectedWarehouse, collectionSlug, categorySlug, searchQuery]);

	if (loading) {
		return (
			<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="animate-pulse">
						<div className="h-64 rounded bg-neutral-200"></div>
						<div className="mt-2 h-4 rounded bg-neutral-200"></div>
						<div className="mt-2 h-4 w-3/4 rounded bg-neutral-200"></div>
					</div>
				))}
			</div>
		);
	}

	return <ProductList products={products} />;
}
