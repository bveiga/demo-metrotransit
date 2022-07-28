import React, { FC, useEffect, useState } from 'react';
import { TransitDirection, TransitRoute, TransitStop } from '../../data/types';
import './RouteNavigator.scss';

import { routeData, directionData, stopData } from '../../data/sampleData';

interface HeaderProps {
    initialActiveStop?: number;
	initialActiveTab?: number;
}

const RouteNavigator: FC<HeaderProps> = ({
    initialActiveStop,
    initialActiveTab = 0
}) => {
    const [state, setState] = useState({
        activeRoute: routeData[0].route_label,
        activeStop: initialActiveStop,
        activeTab: initialActiveTab,
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

    const renderDirections = (direction: TransitDirection, index: number, activeIndex?: number): JSX.Element => {
		const compClasses = (index === activeIndex) ? 'is-active' : '';
		return (
			<li className={compClasses} key={index} data-id={direction.direction_id} onClick={() => selectDirection(index)}>
				<a>{direction.direction_name}</a>
			</li>
		);
	};

    return (
        <>
            <section className='section route-selector'>
                <h1 className='title has-text-light'>Route Selector</h1>
                <h2 className='subtitle has-text-light'>
                    Select a route
                </h2>
                <div className="select">
                    <select onChange={selectRoute}>
                        {state.routes.map((route) => {
                            return (<option key={route.route_id}>{ route.route_label }</option>);
                        })}
                    </select>
                </div>
            </section>
            <section className='section route-display'>
                <h2 className='is-size-4'>
                    {state.activeRoute}
                </h2>
                <div className='tabs is-toggle'>
                    <ul>
                        {state.directions.map((direction, index) => renderDirections(direction, index, state.activeTab))}
                    </ul>
                </div>
            </section>
        </>
	);
}

export default RouteNavigator;
