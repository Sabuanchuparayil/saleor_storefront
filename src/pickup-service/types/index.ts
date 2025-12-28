/**
 * TypeScript types for Click & Collect pickup service integration
 */

export interface Location {
	latitude: number;
	longitude: number;
}

export interface WarehouseInfo {
	id: string;
	name: string;
	distance_km: number;
	pickup_enabled: boolean;
	address?: string;
	city?: string;
	postal_code?: string;
	country?: string;
}

export interface ProductFilter {
	search?: string;
	collections?: string[];
	categories?: string[];
	priceMin?: number;
	priceMax?: number;
	sortBy?: string;
	sortDirection?: "ASC" | "DESC";
}

export interface Pagination {
	first?: number;
	after?: string;
	last?: number;
	before?: string;
}

export interface PickupServiceConfig {
	baseUrl: string;
	channelSlug: string;
	defaultRadiusKm?: number;
}

export interface PickupModeState {
	enabled: boolean;
	selectedWarehouse: WarehouseInfo | null;
	userLocation: Location | null;
	warehouses: WarehouseInfo[];
	loading: boolean;
	error: string | null;
}
