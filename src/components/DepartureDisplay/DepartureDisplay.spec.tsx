import React from 'react';
import ReactDOM from 'react-dom';
import {act} from 'react-dom/test-utils';
import { getAllByText } from '@testing-library/react';
import DepartureDisplay from './DepartureDisplay';
import {mockDepartureData, mockStopData} from '../../data/mockData';

describe('Components | DepartureDisplay', () => {
	let container: HTMLDivElement;
	let component: Element;

	beforeAll(() => {
		container = document.createElement('div');
		document.body.appendChild(container);

		act(() => {
			ReactDOM.render(
				<DepartureDisplay departureList={mockDepartureData.departures} stopData={mockStopData} />
			, container);
			component = container.getElementsByClassName('departure-display')[0];
		});
	});

	it('renders without crashing', () => {
		expect(component).not.toBeNull();
	});

	it('displays table of departures', () => {
		const routeShortName = getAllByText(container, 'Blue');
		expect(routeShortName).not.toBeNull();

		const routeDestination = getAllByText(container, 'to Mpls-Target Field');
		expect(routeDestination).not.toBeNull();

		const departureText = getAllByText(container, '7 Min');
		expect(departureText).not.toBeNull();
	});
});
