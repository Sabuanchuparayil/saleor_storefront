/**
 * Pickup Service API Client
 *
 * Provides functions to interact with the pickup service API
 */

import type { Location, WarehouseInfo, ProductFilter, Pagination } from "../types";

export interface PickupServiceClientConfig {
	baseUrl: string;
	channelSlug: string;
	defaultRadiusKm?: number;
}

export class PickupServiceClient {
	private baseUrl: string;
	private channelSlug: string;
	private defaultRadiusKm: number;

	constructor(config: PickupServiceClientConfig) {
		this.baseUrl = config.baseUrl.replace(/\/$/, ""); // Remove trailing slash
		this.channelSlug = config.channelSlug;
		this.defaultRadiusKm = config.defaultRadiusKm || 25;
	}

	/**
	 * Discover nearby warehouses based on location
	 */
	async discoverWarehouses(location: Location, radiusKm?: number): Promise<WarehouseInfo[]> {
		const response = await fetch(`${this.baseUrl}/pickup/location`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				location: {
					latitude: location.latitude,
					longitude: location.longitude,
				},
				channel_slug: this.channelSlug,
				radius_km: radiusKm || this.defaultRadiusKm,
			}),
		});

		if (!response.ok) {
			const error = (await response.json().catch(() => ({ detail: "Failed to discover warehouses" }))) as {
				detail?: string;
			};
			throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
		}

		const data = (await response.json()) as { warehouses?: WarehouseInfo[] };
		return data.warehouses || [];
	}

	/**
	 * Get products available at a specific warehouse
	 */
	async getProducts(warehouseId: string, filters?: ProductFilter, pagination?: Pagination): Promise<any> {
		const params = new URLSearchParams({
			channel_slug: this.channelSlug,
			warehouse_id: warehouseId,
			...(pagination?.first && { first: pagination.first.toString() }),
			...(pagination?.after && { after: pagination.after }),
			...(pagination?.last && { last: pagination.last.toString() }),
			...(pagination?.before && { before: pagination.before }),
			...(filters?.search && { search: filters.search }),
			...(filters?.collections && { collections: filters.collections.join(",") }),
			...(filters?.categories && { categories: filters.categories.join(",") }),
			...(filters?.priceMin && { price_min: filters.priceMin.toString() }),
			...(filters?.priceMax && { price_max: filters.priceMax.toString() }),
			...(filters?.sortBy && { sort_by: filters.sortBy }),
			...(filters?.sortDirection && { sort_direction: filters.sortDirection }),
		});

		const response = await fetch(`${this.baseUrl}/pickup/products?${params}`);

		if (!response.ok) {
			const error = (await response.json().catch(() => ({ detail: "Failed to fetch products" }))) as {
				detail?: string;
			};
			throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	}

	/**
	 * Get products available at a location (using lat/lon)
	 */
	async getProductsByLocation(
		location: Location,
		filters?: ProductFilter,
		pagination?: Pagination,
		radiusKm?: number,
	): Promise<any> {
		const params = new URLSearchParams({
			channel_slug: this.channelSlug,
			lat: location.latitude.toString(),
			lon: location.longitude.toString(),
			...(radiusKm && { radius_km: radiusKm.toString() }),
			...(pagination?.first && { first: pagination.first.toString() }),
			...(pagination?.after && { after: pagination.after }),
			...(pagination?.last && { last: pagination.last.toString() }),
			...(pagination?.before && { before: pagination.before }),
			...(filters?.search && { search: filters.search }),
			...(filters?.collections && { collections: filters.collections.join(",") }),
			...(filters?.categories && { categories: filters.categories.join(",") }),
			...(filters?.priceMin && { price_min: filters.priceMin.toString() }),
			...(filters?.priceMax && { price_max: filters.priceMax.toString() }),
			...(filters?.sortBy && { sort_by: filters.sortBy }),
			...(filters?.sortDirection && { sort_direction: filters.sortDirection }),
		});

		const response = await fetch(`${this.baseUrl}/pickup/products?${params}`);

		if (!response.ok) {
			const error = (await response.json().catch(() => ({ detail: "Failed to fetch products" }))) as {
				detail?: string;
			};
			throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	}

	/**
	 * Select a warehouse (for session tracking)
	 */
	async selectWarehouse(warehouseId: string): Promise<void> {
		const response = await fetch(`${this.baseUrl}/pickup/select`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				warehouse_id: warehouseId,
				channel_slug: this.channelSlug,
			}),
		});

		if (!response.ok) {
			const error = (await response.json().catch(() => ({ detail: "Failed to select warehouse" }))) as {
				detail?: string;
			};
			throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
		}
	}

	/**
	 * Check service health
	 */
	async healthCheck(): Promise<{ status: string; service: string }> {
		const response = await fetch(`${this.baseUrl}/pickup/health`);

		if (!response.ok) {
			throw new Error(`Health check failed: ${response.statusText}`);
		}

		return (await response.json()) as { status: string; service: string };
	}
}
