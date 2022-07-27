import React, { FC } from 'react';

interface HomePageProps {
	title?: string;
}

const HomePage: FC<HomePageProps> = ({ title }) => {
	return (
        <>
            <h1>Hello React!</h1>
        </>
	);
}

export default HomePage;
