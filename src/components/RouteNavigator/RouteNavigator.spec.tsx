import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter, Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { act } from 'react-dom/test-utils';
import { fireEvent, getByText, getAllByText, screen, waitFor, render } from '@testing-library/react';

import 'whatwg-fetch';
import { rest } from 'msw';
import  { setupServer } from 'msw/node';
import RouteNavigator from './RouteNavigator';
import { mockDepartureData, mockDirectionList, mockRouteList, mockStopList } from '../../data/mockData';

describe('Components | RouteNavigator', () => {
	let container: HTMLDivElement;
	let component: Element;
	const history = createMemoryHistory({ initialEntries: ['/'] });

	const server = setupServer(
		rest.get('https://svc.metrotransit.org/nextripv2/routes', (req, res, ctx) => {
			return res(ctx.json(mockRouteList))
		}),
		rest.get('https://svc.metrotransit.org/nextripv2/Directions/901', (req, res, ctx) => {
			return res(ctx.json(mockDirectionList))
		}),
		rest.get('https://svc.metrotransit.org/nextripv2/Directions/902', (req, res, ctx) => {
			return res(ctx.json(mockDirectionList))
		}),
		rest.get('https://svc.metrotransit.org/nextripv2/Stops/901/0', (req, res, ctx) => {
			return res(ctx.json(mockStopList))
		}),
		rest.get('https://svc.metrotransit.org/nextripv2/901/0/HHTE', (req, res, ctx) => {
			return res(ctx.json(mockDepartureData))
		})
	);

	beforeEach(() => {
		container = document.createElement('div');
		document.body.appendChild(container);

		act(() => {
			ReactDOM.render(
				<Router history={history}>
					<RouteNavigator />
				</Router>
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
		const firstFetchedStop = screen.queryByText('MSP Airport Terminal 2 - Humphrey Station');
		expect(firstFetchedStop).toBeNull();
	});

	it('fetches stops', async () => {
		// Selecting a route
		const firstFetchedRoute = await waitFor(() => getByText(container, 'METRO Blue Line'));
		const routeSelector = screen.getByTestId('select__route') as HTMLSelectElement;

		fireEvent.change(routeSelector, { target: { value: '901' } });
		await waitFor(() => {
			expect(routeSelector.value).toBe('901');
		});

		// Selecting a direction
		const directionSelector = screen.getByTestId('select__direction') as HTMLSelectElement;
		fireEvent.change(directionSelector, { target: { value: '0' } });

		// Checking stops
		const firstFetchedStop = await waitFor(() => getByText(container, 'MSP Airport Terminal 2 - Humphrey Station'));
		expect(firstFetchedStop).not.toBeNull();
	});

	it('can select a stop', async () => {
		// Selecting a route
		const firstFetchedRoute = await waitFor(() => getByText(container, 'METRO Blue Line'));
		const routeSelector = screen.getByTestId('select__route') as HTMLSelectElement;

		fireEvent.change(routeSelector, { target: { value: '901' } });
		await waitFor(() => {
			expect(routeSelector.value).toBe('901');
		});

		// Selecting a direction
		const directionSelector = screen.getByTestId('select__direction') as HTMLSelectElement;
		fireEvent.change(directionSelector, { target: { value: '0' } });

		// Checking stops
		const firstFetchedStop = await waitFor(() => getByText(container, 'MSP Airport Terminal 2 - Humphrey Station'));
		const stopSelector = screen.getByTestId('select__stop') as HTMLSelectElement;
		fireEvent.change(stopSelector, { target: { value: 'HHTE' } });
		await waitFor(() => {
			expect(stopSelector.value).toBe('HHTE');
		});
	});

	it('renders tabs for the two modes', () => {
		const tabsList = screen.getByTestId('tabs__list');
		expect(tabsList).not.toBeNull();

		const firstTab = screen.getByText('By Route');
		expect(firstTab).not.toBeNull();
	});

	it('updates history when departures are fetched', async () => {
		// Selecting a route
		await waitFor(() => getByText(container, 'METRO Blue Line'));
		const routeSelector = screen.getByTestId('select__route') as HTMLSelectElement;
		fireEvent.change(routeSelector, { target: { value: '901' } });

		// Selecting a direction
		await waitFor(() => getByText(container, 'Northbound'));
		const directionSelector = screen.getByTestId('select__direction') as HTMLSelectElement;
		fireEvent.change(directionSelector, { target: { value: '0' } });

		// Selecting a stop
		await waitFor(() => getByText(container, 'MSP Airport Terminal 2 - Humphrey Station'));
		const stopSelector = screen.getByTestId('select__stop') as HTMLSelectElement;
		fireEvent.change(stopSelector, { target: { value: 'HHTE' } });

		// Checking Departure
		await waitFor(() => getAllByText(container, 'to Mpls-Target Field'));
		expect(history.location.pathname).toEqual('/901/0/HHTE');
	});

	it('updates history when route is selected', async () => {
		expect(history.location.pathname).toEqual('/901/0/HHTE');

		// Selecting a route
		await waitFor(() => getByText(container, 'METRO Blue Line'));
		const routeSelector = screen.getByTestId('select__route') as HTMLSelectElement;
		fireEvent.change(routeSelector, { target: { value: '902' } });
		await waitFor(() => expect(history.location.pathname).toEqual('/'))
	});
});
