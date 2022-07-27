import React, { FC } from 'react';
import './RouteSelector.scss';

const RouteSelector: FC = () => {
	return (
        <>
            <section className='section route-selector'>
                <h1 className='title has-text-light'>Route Selector</h1>
                <h2 className='subtitle has-text-light'>
                    Select your individual route
                </h2>
            </section>
        </>
	);
}

export default RouteSelector;
