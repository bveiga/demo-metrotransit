import React, { FC, useEffect, useState } from 'react';
import { Activity } from 'react-feather';
import { TransitDirection, TransitDeparture, TransitRoute, TransitStop } from '../../data/types';
import './RouteNavigator.scss';

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
	const [activeTab, setActiveTab] = useState(0);
	const [activeRoute, setActiveRoute] = useState('');
	const [activeDirection, setActiveDirection] = useState('');
	const [activeStop, setActiveStop] = useState('');
	
	const [routeList, setRouteList] = useState([] as TransitRoute[]);
	const [directionList, setDirectionList] = useState([] as TransitDirection[]);
	const [stopList, setStopList] = useState([] as TransitStop[]);
	const [departureList, setDepartureList] = useState([] as TransitDeparture[]);
	
	const tabLabels = ['By Route', 'By Stop #'];

	/**
	 * Fetch Data
	 */
	useEffect(() => {
		fetch("https://svc.metrotransit.org/nextripv2/routes")
			.then((res) => res.json())
			.then((data) => {
				setRouteList(data);
			});
	}, []);
	
	const selectRoute = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
		let selectedIndex = evt.target.options.selectedIndex;
		let selectedRoute = evt.target.options[selectedIndex].getAttribute('data-id') || '';

		fetch(`https://svc.metrotransit.org/nextripv2/Directions/${selectedRoute}`)
			.then((res) => res.json())
			.then((data) => {
				setActiveRoute(selectedRoute);
				setActiveDirection('');
				setActiveStop('');
				setDepartureList([]);
				setDirectionList(data);
				setStopList([]);
			});
	};

	const selectDirection = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
		let selectedIndex = evt.target.options.selectedIndex;
		let selectedDirection = evt.target.options[selectedIndex].getAttribute('data-id') || '';

		fetch(`https://svc.metrotransit.org/nextripv2/Stops/${activeRoute}/${selectedDirection}`)
			.then((res) => res.json())
			.then((data) => {
				setActiveDirection(selectedDirection);
				setStopList(data);
			});
	};

	const selectStop = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
		let selectedIndex = evt.target.options.selectedIndex;
		let selectedStop = evt.target.options[selectedIndex].getAttribute('data-id') || '';

		fetch(`https://svc.metrotransit.org/nextripv2/${activeRoute}/${activeDirection}/${selectedStop}`)
			.then((res) => res.json())
			.then((data) => {
				setActiveStop(selectedStop);
				setDepartureList(data.departures);
			});
	};

	const selectTab = (index: number): void => {
		setActiveTab(index);
	};
	
	const renderTabs = (tabLabel: string, index: number): JSX.Element => {
		const compClasses = (index === activeTab) ? 'tab is-active' : 'tab';
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
				{!activeTab &&
					<>
						<h1 className='title'>Route Selector</h1>
						<div className='control'>
							<label>Routes</label>
							<div className="select container--route">
								<select className='select__route' onChange={selectRoute}>
									{!activeRoute &&
										<option key={0}>Select a Route</option>
									}
									{routeList.map((route) => {
										return (<option key={route.route_id} data-id={route.route_id}>{ route.route_label }</option>);
									})}
								</select>
							</div>
						</div>
						<div className='control'>
							<label>Directions</label>
							<div className="select container--direction">
								<select className='select__direction' onChange={selectDirection}>
									{!activeDirection &&
										<option key={0}>Select a Direction</option>
									}
									{directionList.map((direction) => {
										return (<option key={direction.direction_id} data-id={direction.direction_id}>{ direction.direction_name }</option>);
									})}
								</select>
							</div>
						</div>
						<div className='control'>
							<label>Stops</label>
							<div className='select container--stop'>
								<select className='select__stop' onChange={selectStop}>
									{!activeStop &&
										<option key={0}>Select a Stop</option>
									}
									{stopList.map((stop) => {
										return (<option key={stop.place_code} data-id={stop.place_code}>{ stop.description }</option>);
									})}
								</select>
							</div>
						</div>
					</>
				}
				{activeTab === 1 && 
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
				{departureList.length > 0 && 
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
							{departureList.map((departure, index) => renderDepartures(departure, index))}
						</tbody>
					</table>
				}
			</section>
		</div>
	);
}

export default RouteNavigator;
