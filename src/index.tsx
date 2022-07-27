import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import HomePage from './pages/HomePage';
import './styles/index.scss'

ReactDOM.render(
    <React.StrictMode>
		<BrowserRouter>
            <Switch>
				<Route path='/' exact component={HomePage} />
            </Switch>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('app-root')
)