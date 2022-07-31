import React, { FC, useEffect, useState } from 'react';
import { Activity } from 'react-feather';
import { TransitDirection, TransitDeparture, TransitRoute, TransitStop } from '../../data/types';
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
		departures: [] as TransitDeparture[],
		directions: [] as TransitDirection[],
		routes: [] as TransitRoute[],
		stops: [] as TransitStop[]
	});
	const tabLabels = ['By Route', 'By Stop #'];

	/**
	 * External Data
	 */
	useEffect(() => {
		fetch("https://svc.metrotransit.org/nextripv2/routes")
			.then((res) => res.json())
			.then((data) => {
				setState({...state, routes: data});
			});
	}, []);

	/**
	 * Component Methods
	 */
	const selectTab = (index: number): void => {
		setState({ ...state, activeTab: index, byRoute: index === 0});
	};
	
	const selectRoute = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
		let selectedIndex = evt.target.options.selectedIndex;
		let activeRoute = evt.target.options[selectedIndex].getAttribute('data-id') || '';

		fetch(`https://svc.metrotransit.org/nextripv2/Directions/${activeRoute}`)
			.then((res) => res.json())
			.then((data) => {
				setState({...state,
					activeRoute: activeRoute, 
					activeDirection: '', 
					activeStop: '',
					departures: [],
					directions: data,
					stops: []
				});
			});
	};

	const selectDirection = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
		let selectedIndex = evt.target.options.selectedIndex;
		let activeDirection = evt.target.options[selectedIndex].getAttribute('data-id') || '';

		fetch(`https://svc.metrotransit.org/nextripv2/Stops/${state.activeRoute}/${activeDirection}`)
			.then((res) => res.json())
			.then((data) => {
				setState({...state,
					activeDirection: activeDirection,
					stops: data
				});
			});
	};

	const selectStop = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
		let selectedIndex = evt.target.options.selectedIndex;
		let activeStop = evt.target.options[selectedIndex].getAttribute('data-id') || '';

		fetch(`https://svc.metrotransit.org/nextripv2/${state.activeRoute}/${state.activeDirection}/${activeStop}`)
			.then((res) => res.json())
			.then((data) => {
				setState({...state,
					activeStop: activeStop,
					departures: data.departures
				});
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
		let isDue = departureText.includes('Min') || departureText.includes('Due');

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
		<div className='container route-navigator'>
			<section className='section section--tabs'>
				<div className='tabs is-boxed is-medium'>
					<label className='sr-only'>Select a method</label>
					<ul>
						{tabLabels.map((tabLabel, index)=> renderTabs(tabLabel, index))}
					</ul>
				</div>
			</section>
			<section className='section section--selector'>
				{state.byRoute &&
					<>
						<h1 className='title'>Route Selector</h1>
						<div className='control'>
							<label>All Routes</label>
							<div className="select container--route">
								<select className='select__route' onChange={selectRoute}>
									{!state.activeRoute &&
										<option key={0}>Select a Route</option>
									}
									{state.routes.map((route) => {
										return (<option key={route.route_id} data-id={route.route_id}>{ route.route_label }</option>);
									})}
								</select>
							</div>
						</div>
						<div className='control'>
							<label>Select a direction</label>
							<div className="select container--direction">
								<select className='select__direction' onChange={selectDirection}>
									{!state.activeDirection &&
										<option key={0}>Select a Direction</option>
									}
									{state.directions.map((direction) => {
										return (<option key={direction.direction_id} data-id={direction.direction_id}>{ direction.direction_name }</option>);
									})}
								</select>
							</div>
						</div>
						<div className='control'>
							<label>Select a stop</label>
							<div className='select container--stop'>
								<select className='select__stop' onChange={selectStop}>
									{!state.activeStop &&
										<option key={0}>Select a Stop</option>
									}
									{state.stops.map((stop) => {
										return (<option key={stop.place_code} data-id={stop.place_code}>{ stop.description }</option>);
									})}
								</select>
							</div>
						</div>
					</>
				}
				{!state.byRoute && 
					<>
						<h1 className='title'>Stop Selector</h1>
						<div className='control'>
							<label>Type in a stop number</label>
							<input className='input' type='text' placeholder='Stop #' />
						</div>
					</>
				}
			</section>
			<section className='section section--display'>
				{state.departures.length > 0 && 
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
				}
			</section>
		</div>
	);
}

export default RouteNavigator;
