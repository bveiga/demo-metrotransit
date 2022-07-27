import React, { FC } from 'react';
import RouteSelector from '../components/RouteSelector/RouteSelector';

interface HomePageProps {
	title?: string;
}

const HomePage: FC<HomePageProps> = ({ title }) => {
	return (
        <>
            <RouteSelector></RouteSelector>
        </>
	);
}

export default HomePage;
