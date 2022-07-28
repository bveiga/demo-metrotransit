import React from 'react';
import ReactDOM from 'react-dom'
import {act} from 'react-dom/test-utils';
import { TransitDirection, TransitRoute, TransitStop } from '../../data/types';
import RouteNavigator from './RouteNavigator';

describe('Components | RouteNavigator', () => {
    it('renders without crashing', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            ReactDOM.render(<RouteNavigator/>, container);
        })

        expect(container).not.toBeNull();
    });
});