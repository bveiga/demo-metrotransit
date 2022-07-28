import React, { FC, useState } from 'react';
import './RouteSelector.scss';
import { routesData } from '../../data/routes';
import { TransitRoute } from '../../data/types';

const RouteSelector: FC = () => {

    const [state, setState] = useState({
		routes: routesData
	});

    return (
        <>
            <section className='section route-selector'>
                <h1 className='title has-text-light'>Route Selector</h1>
                <h2 className='subtitle has-text-light'>
                    Select a route
                </h2>
                <div className="select">
                    <select>
                        {state.routes.map((route) => {
                            return (<option key={route.route_id}>{ route.route_label }</option>);
                        })}
                    </select>
                </div>
            </section>
        </>
	);
}

export default RouteSelector;
