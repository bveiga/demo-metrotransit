import React, { FC, useEffect, useState } from 'react';
import { Activity } from 'react-feather';
import { TransitDirection, TransitDeparture } from '../../data/types';
import './RouteNavigator.scss';

import { routeData, directionData, stopData, departureData } from '../../data/mockData';

interface RouteNavigatorProps {
	initialActiveDirection?: string;
	initialActiveRoute?: string;
	initialActiveStop?: string;
	initialActiveTab?: number;
}

const RouteNavigator: FC<RouteNavigatorProps> = ({
	initialActiveDirection,
	initialActiveRoute,
	initialActiveStop,
	initialActiveTab = 0
}) => {
	const [state, setState] = useState({
		activeDirection: initialActiveDirection,
		activeRoute: initialActiveRoute || routeData[0].route_label,
		activeStop: initialActiveStop,
		activeTab: initialActiveTab,
		byRoute: true,
		departures: departureData.departures,
		directions: directionData,
		routes: routeData,
		stops: stopData
	});

	const tabLabels = ['By Route', 'By Stop #'];

	const selectTab = (index: number): void => {
		setState({ ...state, activeTab: index, byRoute: !state.byRoute});
	};

	const selectRoute = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
		setState({ ...state, activeRoute: evt.target.value});
	};

	const selectDirection = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
		setState({ ...state, activeDirection: evt.target.value });
	};

	const selectStop = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
		setState({ ...state, activeStop: evt.target.value});
	};

	const renderTabs = (tabLabel: string, index: number): JSX.Element => {
		const compClasses = (index === state.activeTab) ? 'tab is-active' : 'tab';
		return (
			<li className={compClasses} key={index} onClick={() => selectTab(index)}>
				<a>{tabLabel}</a>
			</li>
		);
	};

	const renderDepartures = (departure: TransitDeparture, index: number): JSX.Element => {
		let departureText = departure.departure_text;
		let isDue = departureText.includes('Min');

		return (
			<tr className='departure' key={index}>
				<td className='route-number'>{departure.route_short_name}</td>
				<td className='route-name'>{departure.description}</td>
				<td className='departure__time has-text-right'>
					{isDue && 
						<span className='icon is-blinking'>
							<Activity />
						</span>
					}
					<span>{departureText}</span>
				</td>
			</tr>
		);
	};
	
	return (
		<div className='route-navigator'>
			<section className='section section--tabs'>
				<div className='tabs is-boxed'>
					<label className='sr-only'>Select a method</label>
					<ul>
						{tabLabels.map((tabLabel, index)=> renderTabs(tabLabel, index))}
					</ul>
				</div>
			</section>
			<section className='section section--selector'>
				{state.byRoute &&
					<>
						<h1 className='title has-text-light'>Route Selector</h1>
						<h2 className='subtitle has-text-light'>
							Select a route, direction, and stop
						</h2>
						<div className="select container--route">
							<label className='sr-only'>Select a route</label>
							<select className='route-select' onChange={selectRoute}>
								{state.routes.map((route) => {
									return (<option key={route.route_id}>{ route.route_label }</option>);
								})}
							</select>
						</div>
						<div className="select container--direction">
							<label className='sr-only'>Select a route</label>
							<select className='route-select' onChange={selectDirection}>
								{state.directions.map((direction) => {
									return (<option key={direction.direction_id}>{ direction.direction_name }</option>);
								})}
							</select>
						</div>
						<div className='select container--stop'>
							<label className='sr-only'>Select a stop</label>
							<select className='stop-select' onChange={selectStop}>
								{state.stops.map((stop) => {
									return (<option key={stop.place_code}>{ stop.description }</option>);
								})}
							</select>
						</div>
					</>
				}
				{!state.byRoute && 
					<>
						<h1 className='title has-text-light'>Stop Selector</h1>
						<h2 className='subtitle has-text-light'>
							Type in a stop number
						</h2>
						<div className='control'>
							<input className='input' type='text' placeholder='Stop #' />
						</div>
					</>
				}
			</section>
			<section className='section section--display'>
				<table className='table is-fullwidth'>
					<caption className='sr-only'>Departures Table</caption>
					<thead>
						<tr>
							<th scope='col' className='th-route'>Route</th>
							<th scope='col' className='th-destination'>Destination</th>
							<th scope='col' className='th-departs has-text-right'>Departs</th>
						</tr>
					</thead>
					<tbody>
						{state.departures.map((departure, index) => renderDepartures(departure, index))}
					</tbody>
				</table>
			</section>
		</div>
	);
}

export default RouteNavigator;
