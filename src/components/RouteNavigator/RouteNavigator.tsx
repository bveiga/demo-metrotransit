import React, {FC, useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
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
	let {route, direction, stop} = useParams<RouteParams>();

	const [activeTab, setActiveTab] = useState(0);
	const [activeRoute, setActiveRoute] = useState('-1');
	const [activeDirection, setActiveDirection] = useState('');
	const [activeStop, setActiveStop] = useState('');

	const [routeList, setRouteList] = useState([] as TransitRoute[]);
	const [directionList, setDirectionList] = useState([] as TransitDirection[]);
	const [stopList, setStopList] = useState([] as TransitStop[]);
	const [departureList, setDepartureList] = useState([] as TransitDeparture[]);
	const [stopData, setStopData] = useState({} as TransitDepartureStop);

	const tabLabels = ['By Route', 'By Stop #'];

	useEffect(() => {
		fetchRoutes();
		fetchDepartures();

		// Handle back and forward buttons
		return history.listen((location) => {
			if (history.action === 'POP') {
				let paramsArray = location.pathname.split('/');

				if(paramsArray.length !== 4) {
					route = '';
					direction = '';
					stop = '';
				} else {
					route = paramsArray[1];
					direction = paramsArray[2];
					stop = paramsArray[3];
					fetchDepartures();
				}
			}
		});
	}, [history]);

	const fetchDepartures = async () => {
		if (route && direction && stop) {
			const result = await fetch(`https://svc.metrotransit.org/nextripv2/${route}/${direction}/${stop}`);

			if (!result.ok) {
				throw new Error(`fetchDepartures failed with status code: ${result.status}`);
			}

			const data = await result.json();
			setActiveRoute('-1');
			setActiveStop(stop);
			setDirectionList([]);
			setStopList([]);
			setDepartureList(data.departures);
			setStopData(data.stops[0]);
		} else {
			setActiveRoute('-1');
			setActiveDirection('-1');
			setActiveStop('-1');
		}
	};

	const fetchRoutes = async () => {
		const result = await fetch(`https://svc.metrotransit.org/nextripv2/routes`);

		if (!result.ok) {
			throw new Error(`fetchRoutes failed with status code: ${result.status}`);
		}

		const data = await result.json();
		setRouteList(data);
	};

	/**
	 * Event Handlers
	 */
	const selectRoute = async (evt: React.ChangeEvent<HTMLSelectElement>): Promise<void> => {
		let selectedRoute = evt.target.value;
		if(selectedRoute !== '-1') {
			const result = await fetch(`https://svc.metrotransit.org/nextripv2/Directions/${selectedRoute}`);

			if (!result.ok) {
				throw new Error(`selectRoute failed with status code: ${result.status}`);
			}

			const data = await result.json();
			if (history.location.pathname !== '/') {
				history.push('/');
			}

			setActiveRoute(selectedRoute);
			setActiveDirection('-1');
			setActiveStop('-1');
			setDirectionList(data);
			setDepartureList([]);
			setStopList([]);
		}
	};

	const selectDirection = async (evt: React.ChangeEvent<HTMLSelectElement>): Promise<void> => {
		let selectedDirection = evt.target.value;
		if(selectedDirection !== '-1') {
			const result = await fetch(`https://svc.metrotransit.org/nextripv2/Stops/${activeRoute}/${selectedDirection}`);

			if (!result.ok) {
				throw new Error(`selectDirection failed with status code: ${result.status}`);
			}

			const data = await result.json();
					setActiveDirection(selectedDirection);
					setStopList(data);
		}
	};

	const selectStop = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
		let selectedStop = evt.target.value;
		console.log(selectedStop);

		if(selectedStop !== '-1') {
			fetch(`https://svc.metrotransit.org/nextripv2/${activeRoute}/${activeDirection}/${selectedStop}`)
				.then((res) => res.json())
				.then((data) => {
					history.push(`/${activeRoute}/${activeDirection}/${selectedStop}`);
					setActiveStop(selectedStop);
					setDepartureList(data.departures);
					setStopData(data.stops[0]);
				});
		}
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
								<select className='select__route' data-testid='select__route' onChange={selectRoute} value={activeRoute}>
									<option key={0} value='-1'>Select a Route</option>
									{routeList.map((route) => {
										return (
											<option key={route.route_id} value={route.route_id}>
												{route.route_label}
											</option>
										);
									})}
								</select>
							</div>
						</div>
						{activeRoute && directionList.length > 0 && (
							<div className='control'>
								<label>Directions</label>
								<div className='select'>
									<select className='select__direction' data-testid='select__direction' onChange={selectDirection} value={activeDirection}>
										<option key={0} value='-1'>Select a Direction</option>
										{directionList.map((direction) => {
											return (
												<option key={direction.direction_id} value={direction.direction_id}>
													{direction.direction_name}
												</option>
											);
										})}
									</select>
								</div>
							</div>
						)}
						{activeDirection && stopList.length > 0 && (
							<div className='control'>
								<label>Stops</label>
								<div className='select'>
									<select className='select__stop' data-testid='select__stop' onChange={selectStop} value={activeStop}>
										<option key={0} value='-1'>Select a Stop</option>
										{stopList.map((stop) => {
											return (
												<option key={stop.place_code} value={stop.place_code}>
													{stop.description}
												</option>
											);
										})}
									</select>
								</div>
							</div>
						)}
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
				{departureList.length > 0 && activeStop !== '-1' && <DepartureDisplay departureList={departureList} stopData={stopData} />}
			</section>
		</div>
	);
};

export default RouteNavigator;
