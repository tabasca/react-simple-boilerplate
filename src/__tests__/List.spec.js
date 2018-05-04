import React from 'react'
import expect from 'expect.js'

import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({adapter: new Adapter()});

import TestBackend from 'react-dnd-test-backend'
import { DragDropContext } from 'react-dnd'

import List from '../components/list/List'
import RouteItem from '../components/list/RouteItem'

const noop = () => {};

const props = {
	waypoints: [
		{
			address: "Лесная ул., 1, Ольгино",
			coordinates: {
				lat: 60.0013716,
				lng: 30.15266680000002
			},
			id: "1",
			marker: {}
		},
		{
			address: "Лесная ул., 3, Мурино",
			coordinates: {
				lat: 60.039829,
				lng: 30.474531999999954
			},
			id: "2",
			marker: {}
		}
	],
	removeWaypoint: noop,
	moveWaypoint: noop
};

function wrapInTestContext (List) {
	return DragDropContext(TestBackend)(
		class TestContextContainer extends React.Component {
			render () {
				return <List {...this.props} />
			}
		}
	)
}

describe('Components: List', () => {
	it('should render the list and 2 route items', () => {
		const ListContext = wrapInTestContext(List);
		const list = mount(
			<ListContext {...props} />
		);

		expect(list.find('.list').length).to.be(1);
		expect(list.find(RouteItem).length).to.be(2);
	});
});