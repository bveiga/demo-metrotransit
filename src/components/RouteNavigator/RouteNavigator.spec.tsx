import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent, getByText, screen, waitFor } from '@testing-library/react';

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
		rest.get('https://svc.metrotransit.org/nextripv2/Directions/901', (req, res, ctx) => {
			return res(ctx.json(mockDirectionList))
		}),
		rest.get('https://svc.metrotransit.org/nextripv2/Stops/901/0', (req, res, ctx) => {
			return res(ctx.json(mockStopList))
		})
	);

	beforeEach(() => {
		container = document.createElement('div');
		document.body.appendChild(container);

		act(() => {
			ReactDOM.render(
				<MemoryRouter>
					<RouteNavigator />
				</MemoryRouter>
			, container);
			component = container.getElementsByClassName('route-navigator')[0];
		});
	});

	beforeAll(() => server.listen());

	afterEach(() => {
		server.resetHandlers();
		document.body.innerHTML = '';
	});
	afterAll(() => server.close());

	it('renders without crashing', () => {
		expect(component).not.toBeNull();
	});

	it('fetches routes on load', async () => {
		const firstFetchedRoute = await waitFor(() => getByText(container, 'METRO Blue Line'));
		expect(firstFetchedRoute).not.toBeNull();
	});

	it('can select a route', async () => {
		const firstFetchedRoute = await waitFor(() => getByText(container, 'METRO Blue Line'));
		const routeSelector = screen.getByTestId('select__route') as HTMLSelectElement;

		fireEvent.change(routeSelector, { target: { value: '901' } });
		await waitFor(() => {
			expect(routeSelector.value).toBe('901');
		});
	});

	it('does not fetch directions until route is selected', async () => {
		const firstFetchedRoute = await waitFor(() => getByText(container, 'METRO Blue Line'));
		let firstFetchedDirection = screen.queryByText('Northbound');
		expect(firstFetchedDirection).toBeNull();
	});

	it('fetches directions', async () => {
		const firstFetchedRoute = await waitFor(() => getByText(container, 'METRO Blue Line'));
		const routeSelector = screen.getByTestId('select__route');

		fireEvent.change(routeSelector, { target: { value: '901' } });
		const firstFetchedDirection = await waitFor(() => getByText(container, 'Northbound'));
		expect(firstFetchedDirection).not.toBeNull();
	});

	it('can select a direction', async () => {
		// Selecting a route
		const firstFetchedRoute = await waitFor(() => getByText(container, 'METRO Blue Line'));
		const routeSelector = screen.getByTestId('select__route') as HTMLSelectElement;

		fireEvent.change(routeSelector, { target: { value: '901' } });
		await waitFor(() => {
			expect(routeSelector.value).toBe('901');
		});

		// Selecting a direction
		const firstFetchedDirection = await waitFor(() => getByText(container, 'Northbound'));
		const directionSelector = screen.getByTestId('select__direction') as HTMLSelectElement;

		fireEvent.change(directionSelector, { target: { value: '0' } });
		await waitFor(() => {
			expect(directionSelector.value).toBe('0');
		});
	});


	it('does not fetch stop until direction is selected', async () => {
	});

	it('loads stops', () => {
	});

	it('can select a stop', () => {});

	it('loads new direction tabs when route is selected', () => {});

	it('loads new stops when direction is selected', () => {});
});
