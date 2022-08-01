import React from 'react';
import ReactDOM from 'react-dom';
import {act} from 'react-dom/test-utils';
import {fireEvent} from '@testing-library/react';
import RouteNavigator from './RouteNavigator';

describe('Components | RouteNavigator', () => {
	let container: HTMLDivElement;
	let component: Element;

	beforeAll(() => {
		container = document.createElement('div');
		document.body.appendChild(container);

		act(() => {
			ReactDOM.render(<RouteNavigator />, container);
			component = container.getElementsByClassName('route-navigator')[0];
		});
	});

	it('renders without crashing', () => {
		expect(component).not.toBeNull();
	});

	it('renders the route selector section', () => {
		let routeSelectorSection = component.getElementsByClassName('container--route')[0];
		expect(routeSelectorSection).not.toBeNull();
	});

	it('renders the stop selector section', () => {});

	it('renders the display section', () => {
		let routeDisplaySection = component.getElementsByClassName('section--display')[0];
		expect(routeDisplaySection).not.toBeNull();
	});

	it('loads routes', () => {
		const routeSelectContainer = component.getElementsByClassName('container--route')[0];
		let routeSelect = routeSelectContainer.getElementsByTagName('select')[0];
		let options = routeSelect.getElementsByTagName('option');

		expect(options.length).toBeGreaterThan(0);
	});

	it('can select a route', () => {
		const routeSelectContainer = component.getElementsByClassName('container--route')[0];
		let routeSelect = routeSelectContainer.getElementsByTagName('select')[0];
		let options = routeSelect.getElementsByTagName('option');
		let middleOptionLabel = options[options.length / 2].value;

		expect(routeSelect.value).not.toBe(middleOptionLabel);
		fireEvent.change(routeSelect, {target: {value: middleOptionLabel}});
		expect(routeSelect.value).toBe(middleOptionLabel);
	});

	it('loads directions', () => {
		const directionContainer = component.getElementsByClassName('container--direction')[0];
		let directionSelect = directionContainer.getElementsByTagName('select')[0];
		let options = directionSelect.getElementsByTagName('option');

		expect(options.length).toBeGreaterThan(0);
	});

	it('can select a direction', () => {
		const directionContainer = component.getElementsByClassName('container--direction')[0];
		let directionSelect = directionContainer.getElementsByTagName('select')[0];
		let options = directionSelect.getElementsByTagName('option');
		let middleOptionLabel = options[options.length / 2].value;

		expect(directionSelect.value).not.toBe(middleOptionLabel);
		fireEvent.change(directionSelect, {target: {value: middleOptionLabel}});
		expect(directionSelect.value).toBe(middleOptionLabel);
	});

	it('loads stops', () => {
		const stopContainer = component.getElementsByClassName('container--direction')[0];
		let stopSelect = stopContainer.getElementsByTagName('select')[0];
		let options = stopSelect.getElementsByTagName('option');

		expect(options.length).toBeGreaterThan(0);
	});

	it('can select a stop', () => {});

	it('loads new direction tabs when route is selected', () => {});

	it('loads new stops when direction is selected', () => {});
});
