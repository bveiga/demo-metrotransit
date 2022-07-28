import React from 'react';
import ReactDOM from 'react-dom'
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

	it('renders the route selector', () => {
		let routeSelectorSection = component.getElementsByClassName('route-selector')[0];
		expect(routeSelectorSection).not.toBeNull();
	});

	it('renders the route display', () => {
		let routeDisplaySection = component.getElementsByClassName('route-display')[0];
		expect(routeDisplaySection).not.toBeNull();
	});

	it('loads routes', () => {
		let routeSelectorSection = component.getElementsByClassName('route-selector')[0];
		let routeSelect = routeSelectorSection.getElementsByTagName('select')[0];
		let options = routeSelect.getElementsByTagName('option');

		expect(options.length).toBeGreaterThan(0);
	});

	it('can select a new route', () => {
		const routeSelectorSection = component.getElementsByClassName('route-selector')[0];
		let routeSelect = routeSelectorSection.getElementsByTagName('select')[0];
		let options = routeSelect.getElementsByTagName('option');
		let middleOptionLabel = options[options.length / 2].value;
		
		expect(routeSelect.value).not.toBe(middleOptionLabel);
		fireEvent.change(routeSelect, {target: {value: middleOptionLabel}});
		expect(routeSelect.value).toBe(middleOptionLabel);
	});

	it('can select a direction', () => {
		const routeDisplaySection = component.getElementsByClassName('route-display')[0];
		let directionTabs = routeDisplaySection.getElementsByTagName('li');
		
		expect(directionTabs[0].classList.contains('is-active')).toBe(true);
		fireEvent.click(directionTabs[1], 1);
		expect(directionTabs[1].classList.contains('is-active')).toBe(true);
	});

	it('can select a stop', () => {
		
	});

	it('loads new direction tabs when route is selected', () => {
		
	});

	it('loads new stops when direction is selected', () => {
		
	});

	it('displays table of times for the selected stop', () => {
		
	});
});