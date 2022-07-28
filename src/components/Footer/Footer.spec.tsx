import React from 'react';
import ReactDOM from 'react-dom'
import {act} from 'react-dom/test-utils';
import { TransitDirection, TransitRoute, TransitStop } from '../../data/types';
import Footer from './Footer';

describe('Components | Footer', () => {
	let container: HTMLDivElement;
	beforeAll(() => {
		container = document.createElement('div');
		document.body.appendChild(container);
		
		act(() => {
			ReactDOM.render(<Footer copyrightInfo='Bruno Veiga'/>, container);
		});
	});

	it('renders without crashing', () => {
		expect(container).not.toBeNull();
	});
});