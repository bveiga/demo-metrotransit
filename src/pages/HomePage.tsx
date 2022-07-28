import React, { FC } from 'react';
import RouteNavigator from '../components/RouteNavigator/RouteNavigator';

interface HomePageProps {
	title?: string;
}

const HomePage: FC<HomePageProps> = ({ title }) => {
	return (
        <>
            <RouteNavigator></RouteNavigator>
        </>
	);
}

export default HomePage;
