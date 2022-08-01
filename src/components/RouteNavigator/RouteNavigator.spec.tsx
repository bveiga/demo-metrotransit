import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import {act} from 'react-dom/test-utils';
import RouteNavigator from './RouteNavigator';
import nock from 'nock';
import 'whatwg-fetch';
import { mockDepartureData, mockDirectionList, mockRouteList, mockStopList } from '../../data/mockData';

describe('Components | RouteNavigator', () => {
	let container: HTMLDivElement;
	let component: Element;
	let routeFetch: nock.Scope;
	let directionFetch: nock.Scope;
	let stopFetch: nock.Scope;
	let departureFetch: nock.Scope;

	beforeAll(() => {
		routeFetch = nock('https://svc.metrotransit.org')
			.get('/nextripv2/routes')
			.once()
			.reply(200, {
				data: mockRouteList,
			});

		directionFetch = nock('https://svc.metrotransit.org')
			.get('/nextripv2/Directions/901')
			.once()
			.reply(200, {
				data: mockStopList,
			});

		stopFetch = nock('https://svc.metrotransit.org')
			.get('/nextripv2/Stops/901/0')
			.once()
			.reply(200, {
				data: mockStopList,
			});

		departureFetch = nock('https://svc.metrotransit.org')
			.get('/nextripv2/901/0/HHTE')
			.once()
			.reply(200, {
				data: mockDepartureData,
			});

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

	it('renders without crashing', () => {
		expect(component).not.toBeNull();
	});

	it('loads routes', async () => {

	});

	it('can select a route', () => {
		// const routeSelectContainer = component.getElementsByClassName('container--route')[0];
		// let routeSelect = routeSelectContainer.getElementsByTagName('select')[0];
		// let options = routeSelect.getElementsByTagName('option');
		// let middleOptionLabel = options[options.length / 2].value;

		// expect(routeSelect.value).not.toBe(middleOptionLabel);
		// fireEvent.change(routeSelect, {target: {value: middleOptionLabel}});
		// expect(routeSelect.value).toBe(middleOptionLabel);
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
