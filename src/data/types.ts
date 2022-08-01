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

export interface TransitDeparture {
	actual: Boolean;
	trip_id: string;
	stop_id: number;
	departure_text: string;
	departure_time: number;
	description: string;
	route_id: string;
	route_short_name: string;
	direction_id: number;
	direction_text: string;
	schedule_relationship: string;
}

export interface TransitDepartureStop {
	stop_id: number;
	latitude: number;
	longitude: number;
	description: string;
}
