import React, { FC, useEffect, useState } from 'react';
import { Activity } from 'react-feather';
import { TransitDirection, TransitDeparture } from '../../data/types';
import './RouteNavigator.scss';

import { routeData, directionData, stopData, departureData } from '../../data/mockData';

interface RouteNavigatorProps {
	initialActiveDirection?: string;
	initialActiveRoute?: string;
	initialActiveStop?: string;
	initialActiveTab?: string;
}

const RouteNavigator: FC<RouteNavigatorProps> = ({
	initialActiveDirection,
	initialActiveRoute,
	initialActiveStop,
	initialActiveTab
}) => {
	const [state, setState] = useState({
		activeDirection: '',
		activeRoute: '',
		activeStop: '',
		activeTab: 0,
		byRoute: true,
		departures: departureData.departures,
		directions: directionData,
		routes: routeData,
		stops: stopData
	});
	const tabLabels = ['By Route', 'By Stop #'];

	/**
	 * External Data
	 */
	useEffect(() => {
		fetch("https://svc.metrotransit.org/nextripv2/routes")
			.then((res) => res.json())
			.then((data) => {
				setState({...state, routes: data, activeRoute: data[0].route_id});
				console.log(data);
				console.log(data[0].route_id);
			});
	}, []);

	/**
	 * Component Methods
	 */
	const selectTab = (index: number): void => {
		setState({ ...state, activeTab: index, byRoute: !state.byRoute});
	};
	
	const selectRoute = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
		let activeRoute = evt.target.getAttribute('data-id') || '';

		fetch(`https://svc.metrotransit.org/nextripv2/Directions/${state.activeRoute}`)
			.then((res) => res.json())
			.then((data) => {
				setState({...state, directions: data});
				setState({...state, activeRoute: activeRoute, activeDirection: '', activeStop: ''});
			});
	};

	const selectDirection = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
		let activeDirection = evt.target.getAttribute('data-id') || '';

		fetch(`https://svc.metrotransit.org/nextripv2/Stops/${state.activeRoute}/${state.activeDirection}`)
			.then((res) => res.json())
			.then((data) => {
				setState({...state, stops: data});
				setState({...state, activeDirection: activeDirection});
			});
	};

	const selectStop = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
		let activeStop = evt.target.getAttribute('data-id') || '';

		fetch(`https://svc.metrotransit.org/nextripv2/${state.activeRoute}/${state.activeDirection}/${state.activeStop}`)
			.then((res) => res.json())
			.then((data) => {
				setState({...state, departures: data.departures});
				setState({...state, activeStop: activeStop});
			});
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
	
	/**
	 * Markup
	 */
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
								{!state.activeRoute &&
									<option key={0}>Loading...</option>
								}
								{state.activeRoute && state.routes.map((route) => {
									return (<option key={route.route_id} data-id={route.route_id}>{ route.route_label }</option>);
								})}
							</select>
						</div>
						{state.activeRoute && 
							<div className="select container--direction">
								<label className='sr-only'>Select a route</label>
								<select className='route-select' onChange={selectDirection}>
									{state.activeRoute && state.directions.map((direction) => {
										return (<option key={direction.direction_id}>{ direction.direction_name }</option>);
									})}
								</select>
							</div>
						}
						{state.activeDirection && 
							<div className='select container--stop'>
								<label className='sr-only'>Select a stop</label>
								<select className='stop-select' onChange={selectStop}>
									{state.activeDirection && state.stops.map((stop) => {
										return (<option key={stop.place_code}>{ stop.description }</option>);
									})}
								</select>
							</div>
						}
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
