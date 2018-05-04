import React from 'react'
import expect from 'expect.js'

import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({adapter: new Adapter()});

import sinon from 'sinon'

import TestBackend from 'react-dnd-test-backend'
import { DragDropContext } from 'react-dnd'
import TestUtils from 'react-dom/test-utils'

import RouteItem from '../components/list/RouteItem'

function wrapInTestContext (RouteItem) {
	return DragDropContext(TestBackend)(
		class TestContextContainer extends React.Component {
			render () {
				return <RouteItem {...this.props} />
			}
		}
	)
}

// the original is the routeItem without the drag and drop decorations
const OriginalRouteItem = RouteItem.DecoratedComponent;
const identity = el => el;

const props = {
	connectDragSource: identity,
	connectDropTarget: identity,
	waypoint: {
		address: 'Лесная, 1',
	},
	onDelete: sinon.spy(),
	moveWaypoint: sinon.spy(),
	isDragging: false
};

describe('Components: RouteItem', () => {
	it('should render the route address', () => {
		const route = shallow(
			<OriginalRouteItem {...props} />
		);
		expect(route.is('li')).to.be(true);
		expect(route.childAt(0).is('span')).to.be(true);
		expect(route.childAt(0).text().trim()).to.be(props.waypoint.address)
	});

	it('should set the right property to onClick function', () => {
		const route = shallow(
			<OriginalRouteItem {...props} />
		);
		expect(route.instance().props.onDelete).equal(props.onDelete);
	});

	it('should call onDelete prop on click of the del btn', () => {
		const route = shallow(
			<OriginalRouteItem {...props} />
		);

		expect(route.instance().props.onDelete.callCount).to.be(0);
		route.find('.list__del').simulate('click');
		expect(route.instance().props.onDelete.callCount).to.be(1)
	});

	it('should change the item\'s opacity when dragging', () => {
		const RouteItemContext = wrapInTestContext(RouteItem);
		const root = TestUtils.renderIntoDocument(<RouteItemContext {...props} />);
		const backend = root.getManager().getBackend();

		let route = TestUtils.findRenderedDOMComponentWithTag(root, 'li');
		expect(route.style.opacity).to.be('1');

		const routeItem = TestUtils.findRenderedComponentWithType(root, RouteItem);
		backend.simulateBeginDrag([ routeItem.getDecoratedComponentInstance().getHandlerId() ]);

		route = TestUtils.findRenderedDOMComponentWithTag(root, 'li');
		expect(route.style.opacity).to.be('0')
	});
});