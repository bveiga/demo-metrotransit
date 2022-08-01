import React from 'react';
import ReactDOM from 'react-dom';
import {act} from 'react-dom/test-utils';
import {fireEvent} from '@testing-library/react';
import {mockDepartureData, mockStopData} from '../../data/mockData';
import DepartureDisplay from './DepartureDisplay';

describe('Components | DepartureDisplay', () => {
	let container: HTMLDivElement;
	let component: Element;

	beforeAll(() => {
		container = document.createElement('div');
		document.body.appendChild(container);

		act(() => {
			ReactDOM.render(<DepartureDisplay departureList={mockDepartureData.departures} stopData={mockStopData} />, container);
			component = container.getElementsByClassName('route-navigator')[0];
		});
	});

	it('renders without crashing', () => {
		expect(component).not.toBeNull();
	});

	it('displays table of departures', () => {});
});
