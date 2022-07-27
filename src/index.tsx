import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './styles/index.scss'
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';

const currentYear: number = new Date().getFullYear();
ReactDOM.render(
    <React.StrictMode>
		<BrowserRouter>
            <Switch>
				<Route path='/' exact component={HomePage} />
            </Switch>
            <Footer copyrightInfo={`Copyright © ${currentYear} All Rights Reserved | Dev & Design by Bruno Veiga`} />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('app-root')
);