export const routeData = [
	{
		route_id: '901',
		agency_id: 0,
		route_label: 'METRO Blue Line',
	},
	{
		route_id: '902',
		agency_id: 0,
		route_label: 'METRO Green Line',
	},
	{
		route_id: '904',
		agency_id: 0,
		route_label: 'METRO Orange Line',
	},
	{
		route_id: '903',
		agency_id: 0,
		route_label: 'METRO Red Line',
	},
	{
		route_id: '921',
		agency_id: 0,
		route_label: 'METRO A Line',
	},
	{
		route_id: '923',
		agency_id: 0,
		route_label: 'METRO C Line',
	},
];

export const directionData = [
	{
		direction_id: 0,
		direction_name: 'Northbound',
	},
	{
		direction_id: 1,
		direction_name: 'Southbound',
	},
];

export const stopData = [
	{
		place_code: 'HHTE',
		description: 'MSP Airport Terminal 2 - Humphrey Station',
	},
	{
		place_code: 'LIND',
		description: 'MSP Airport Terminal 1 - Lindbergh Station',
	},
	{
		place_code: 'FTSN',
		description: 'Fort Snelling Station',
	},
];

export const departureData = {
	stops: [
		{
			stop_id: 51435,
			latitude: 44.874119,
			longitude: -93.224068,
			description: 'Terminal 2 Humphrey Station',
		},
	],
	alerts: [],
	departures: [
		{
			actual: true,
			trip_id: '21226119-JUN22-RAIL-Weekday-02',
			stop_id: 51435,
			departure_text: '7 Min',
			departure_time: 1659042240,
			description: 'to Mpls-Target Field',
			route_id: '901',
			route_short_name: 'Blue',
			direction_id: 0,
			direction_text: 'NB',
			schedule_relationship: 'Scheduled',
		},
		{
			actual: false,
			trip_id: '21226123-JUN22-RAIL-Weekday-02',
			stop_id: 51435,
			departure_text: '4:16',
			departure_time: 1659042960,
			description: 'to Mpls-Target Field',
			route_id: '901',
			route_short_name: 'Blue',
			direction_id: 0,
			direction_text: 'NB',
			schedule_relationship: 'Scheduled',
		},
		{
			actual: false,
			trip_id: '21226124-JUN22-RAIL-Weekday-02',
			stop_id: 51435,
			departure_text: '4:28',
			departure_time: 1659043680,
			description: 'to Mpls-Target Field',
			route_id: '901',
			route_short_name: 'Blue',
			direction_id: 0,
			direction_text: 'NB',
			schedule_relationship: 'Scheduled',
		},
	],
};
