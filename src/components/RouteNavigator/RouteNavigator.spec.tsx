import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { getByText, waitFor } from '@testing-library/react';

import 'whatwg-fetch';
import { rest } from 'msw';
import  { setupServer } from 'msw/node';
import RouteNavigator from './RouteNavigator';
import { mockDepartureData, mockDirectionList, mockRouteList, mockStopList } from '../../data/mockData';

describe('Components | RouteNavigator', () => {
	let container: HTMLDivElement;
	let component: Element;

	const server = setupServer(
		rest.get('https://svc.metrotransit.org/nextripv2/routes', (req, res, ctx) => {
			return res(ctx.json(mockRouteList))
		}),
	);

	beforeAll(() => {
		server.listen();

		container = document.createElement('div');
		document.body.appendChild(container);
	});

	afterEach(() => server.resetHandlers());
	afterAll(() => server.close());

	it('renders without crashing', () => {
		act(() => {
			ReactDOM.render(
				<MemoryRouter>
					<RouteNavigator />
				</MemoryRouter>
			, container);
			component = container.getElementsByClassName('route-navigator')[0];
		});

		expect(component).not.toBeNull();
	});

	it('fetches routes on load', async () => {
		act(() => {
			ReactDOM.render(
				<MemoryRouter>
					<RouteNavigator />
				</MemoryRouter>
			, container);
			component = container.getElementsByClassName('route-navigator')[0];
		});

		const firstFetchedRoute = await waitFor(() => getByText(container, 'METRO Blue Line'));
		expect(firstFetchedRoute).not.toBeNull();
	});

	it('can select a route', async () => {

	});

	it('loads directions', () => {
		// const directionContainer = component.getElementsByClassName('container--direction')[0];
		// let directionSelect = directionContainer.getElementsByTagName('select')[0];
		// let options = directionSelect.getElementsByTagName('option');

		// expect(options.length).toBeGreaterThan(0);
	});

	it('can select a direction', () => {
		// const directionContainer = component.getElementsByClassName('container--direction')[0];
		// let directionSelect = directionContainer.getElementsByTagName('select')[0];
		// let options = directionSelect.getElementsByTagName('option');
		// let middleOptionLabel = options[options.length / 2].value;

		// expect(directionSelect.value).not.toBe(middleOptionLabel);
		// fireEvent.change(directionSelect, {target: {value: middleOptionLabel}});
		// expect(directionSelect.value).toBe(middleOptionLabel);
	});

	it('loads stops', () => {
		// const stopContainer = component.getElementsByClassName('container--direction')[0];
		// let stopSelect = stopContainer.getElementsByTagName('select')[0];
		// let options = stopSelect.getElementsByTagName('option');

		// expect(options.length).toBeGreaterThan(0);
	});

	it('can select a stop', () => {});

	it('loads new direction tabs when route is selected', () => {});

	it('loads new stops when direction is selected', () => {});
});
