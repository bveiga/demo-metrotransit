import React, {FC} from 'react';
import {Activity} from 'react-feather';
import {TransitDeparture, TransitDepartureStop} from '../../data/types';

interface DeparturesDisplayProps {
	departureList: TransitDeparture[];
	stopData: TransitDepartureStop;
}

const DeparturesDisplay: FC<DeparturesDisplayProps> = ({
	departureList,
	stopData,
}) => {
	const renderDepartures = (departure: TransitDeparture, index: number): JSX.Element => {
		let departureText = departure.departure_text;
		let isDue = departureText.includes('Min') || departureText.includes('Due');

		return (
			<tr className='departure' key={index}>
				<td className='route-number'>{departure.route_short_name}</td>
				<td className='route-name'>{departure.description}</td>
				<td className='departure__time has-text-right'>
					{isDue && (
						<span className='icon is-blinking'>
							<Activity />
						</span>
					)}
					<span>{departureText}</span>
				</td>
			</tr>
		);
	};

	/**
	 * Markup
	 */
	return (
		<div className='departure-display'>
			<div className='container departures-heading'>
				<h2 className='is-size-3'>{stopData.description}</h2>
			</div>
			<table className='table is-fullwidth'>
				<caption className='sr-only'>Departures Table</caption>
				<thead>
					<tr>
						<th scope='col' className='th-route'>
							Route
						</th>
						<th scope='col' className='th-destination'>
							Destination
						</th>
						<th scope='col' className='th-departs has-text-right'>
							Departs
						</th>
					</tr>
				</thead>
				<tbody>{departureList.map((departure, index) => renderDepartures(departure, index))}</tbody>
			</table>
		</div>
	);
};

export default DeparturesDisplay;
