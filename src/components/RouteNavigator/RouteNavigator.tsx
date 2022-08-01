import React, {FC, useEffect, useRef, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Activity} from 'react-feather';
import DepartureDisplay from '../DepartureDisplay/DepartureDisplay';
import {TransitDirection, TransitDeparture, TransitDepartureStop, TransitRoute, TransitStop} from '../../data/types';
import './RouteNavigator.scss';

interface RouteParams {
	route: string;
	direction: string;
	stop: string;
}

const RouteNavigator: FC = () => {
	let history = useHistory();
	const {route, direction, stop} = useParams<RouteParams>();

	const [activeTab, setActiveTab] = useState(0);
	const [activeRoute, setActiveRoute] = useState('');
	const [activeDirection, setActiveDirection] = useState('');
	const [activeStop, setActiveStop] = useState('');

	const [routeList, setRouteList] = useState([] as TransitRoute[]);
	const [directionList, setDirectionList] = useState([] as TransitDirection[]);
	const [stopList, setStopList] = useState([] as TransitStop[]);
	const [departureList, setDepartureList] = useState([] as TransitDeparture[]);
	const [stopData, setStopData] = useState({} as TransitDepartureStop);

	const tabLabels = ['By Route', 'By Stop #'];

	useEffect(() => {
		// Handle situation where route, direction, and stop are already in the url
		if (route && direction && stop) {
			console.log(`Data: ${route}, ${direction}, ${stop}`);
			fetch(`https://svc.metrotransit.org/nextripv2/${route}/${direction}/${stop}`)
				.then((res) => res.json())
				.then((data) => {
					setDepartureList(data.departures);
					setStopData(data.stops[0]);
				});
		}

		fetch('https://svc.metrotransit.org/nextripv2/routes')
			.then((res) => res.json())
			.then((data) => {
				setRouteList(data);
			});
	}, []);

	/**
	 * Event Handlers
	 */
	const selectRoute = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
		let selectedIndex = evt.target.options.selectedIndex;
		let selectedRoute = evt.target.options[selectedIndex].getAttribute('data-id') || '';

		fetch(`https://svc.metrotransit.org/nextripv2/Directions/${selectedRoute}`)
			.then((res) => res.json())
			.then((data) => {
				if (history.location.pathname !== '/') {
					history.push('/');
				}

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
				history.push(`/${activeRoute}/${activeDirection}/${selectedStop}`);
				setActiveStop(selectedStop);
				setDepartureList(data.departures);
			});
	};

	const selectTab = (index: number): void => {
		setActiveTab(index);
	};

	const renderTabs = (tabLabel: string, index: number): JSX.Element => {
		const compClasses = index === activeTab ? 'tab is-active' : 'tab';
		return (
			<li className={compClasses} key={index} onClick={() => selectTab(index)}>
				<a>{tabLabel}</a>
			</li>
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
					<ul>{tabLabels.map((tabLabel, index) => renderTabs(tabLabel, index))}</ul>
				</div>
			</section>
			<section className='section section--selector'>
				{!activeTab && (
					<>
						<h1 className='title'>Route Selection</h1>
						<div className='control'>
							<label>Routes</label>
							<div className='select'>
								<select className='select__route' onChange={selectRoute}>
									{!activeRoute && <option key={0}>Select a Route</option>}
									{routeList.map((route) => {
										return (
											<option key={route.route_id} data-id={route.route_id}>
												{route.route_label}
											</option>
										);
									})}
								</select>
							</div>
						</div>
						<div className='control'>
							<label>Directions</label>
							<div className='select'>
								<select className='select__direction' onChange={selectDirection}>
									{!activeDirection && <option key={0}>Select a Direction</option>}
									{directionList.map((direction) => {
										return (
											<option key={direction.direction_id} data-id={direction.direction_id}>
												{direction.direction_name}
											</option>
										);
									})}
								</select>
							</div>
						</div>
						<div className='control'>
							<label>Stops</label>
							<div className='select'>
								<select className='select__stop' onChange={selectStop}>
									{!activeStop && <option key={0}>Select a Stop</option>}
									{stopList.map((stop) => {
										return (
											<option key={stop.place_code} data-id={stop.place_code}>
												{stop.description}
											</option>
										);
									})}
								</select>
							</div>
						</div>
					</>
				)}
				{activeTab === 1 && (
					<>
						<h1 className='title'>Stop Selector</h1>
						<div className='control'>
							<label>Type in a stop number</label>
							<input className='input' type='text' placeholder='Stop #' />
						</div>
					</>
				)}
			</section>
			<section className='section section--display'>
				{departureList.length > 0 && <DepartureDisplay departureList={departureList} stopData={stopData} />}
			</section>
		</div>
	);
};

export default RouteNavigator;
