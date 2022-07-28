import React, { FC, useEffect, useState } from 'react';
import { TransitDirection, TransitDeparture } from '../../data/types';
import './RouteNavigator.scss';

import { routeData, directionData, stopData, departureData } from '../../data/mockData';

interface RouteNavigatorProps {
	initialActiveRoute?: string;
	initialActiveStop?: string;
	initialActiveTab?: number;
}

const RouteNavigator: FC<RouteNavigatorProps> = ({
	initialActiveRoute,
	initialActiveStop,
	initialActiveTab = 0
}) => {
	const [state, setState] = useState({
		activeRoute: initialActiveRoute || routeData[0].route_label,
		activeStop: initialActiveStop,
		activeTab: initialActiveTab,
		departures: departureData.departures,
		directions: directionData,
		routes: routeData,
		stops: stopData
	});

	const selectRoute = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
		let label = evt.target.value;
		setState({ ...state, activeRoute: label});
	}

	const selectDirection = (index: number): void => {
		setState({ ...state, activeTab: index });
	};

	const selectStop = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
		let label = evt.target.value;
		setState({ ...state, activeStop: label});
	};

	const renderDirections = (direction: TransitDirection, index: number, activeIndex?: number): JSX.Element => {
		const compClasses = (index === activeIndex) ? 'tab is-active' : 'tab';
		return (
			<li className={compClasses} key={index} data-id={direction.direction_id} onClick={() => selectDirection(index)}>
				<a>{direction.direction_name}</a>
			</li>
		);
	};

	const renderDepartures = (departure: TransitDeparture, index: number): JSX.Element => {
		let departureText = departure.departure_text;
		let isDue = departureText.includes('Min');

		return (
			<tr className='departure'>
				<td className='route-number'>{departure.route_short_name}</td>
				<td className='route-name'>{departure.description}</td>
				<td className='depart-time has-text-right'>
					{isDue && <i className='fa-solid fa-bolt-lightning'></i>}
					<span>{departureText}</span>
				</td>
			</tr>
		);
	};

	return (
		<div className='route-navigator'>
			<section className='section section__tabs'>
				<div className='tabs is-boxed'>
					<label className='sr-only'>Select a method</label>
					<ul>
						{state.directions.map((direction, index) => renderDirections(direction, index, state.activeTab))}
					</ul>
				</div>
			</section>
			<section className='section section__selector'>
				<h1 className='title has-text-light'>Route Selector</h1>
				<h2 className='subtitle has-text-light'>
					Select a route, direction, and stop
				</h2>
				<div className="select route-select-container">
					<label className='sr-only'>Select a route</label>
					<select className='route-select' onChange={selectRoute}>
						{state.routes.map((route) => {
							return (<option key={route.route_id}>{ route.route_label }</option>);
						})}
					</select>
				</div>
				<div className="select direction-select-container">
					<label className='sr-only'>Select a route</label>
					<select className='route-select' onChange={selectRoute}>
						{state.directions.map((direction) => {
							return (<option key={direction.direction_id}>{ direction.direction_name }</option>);
						})}
					</select>
				</div>
				<div className='select stop-select-container'>
					<label className='sr-only'>Select a stop</label>
					<select className='stop-select' onChange={selectStop}>
						{state.stops.map((stop) => {
							return (<option key={stop.place_code}>{ stop.description }</option>);
						})}
					</select>
				</div>
			</section>
			<section className='section section__display'>
				<table className='table is-fullwidth'>
					<caption className='sr-only'>Departures Table</caption>
					<thead>
						<tr>
							<th className='th-route'>Route</th>
							<th className='th-destination'>Destination</th>
							<th className='th-departs has-text-right'>Departs</th>
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
