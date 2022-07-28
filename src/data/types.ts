export interface TransitRoute {
	route_id: string;
	agency_id: number;
	route_label: string;
}

export interface TransitDirection {
	direction_id: number;
	direction_name: string;
}

export interface TransitStop {
	place_code: string;
	description: string;
}
