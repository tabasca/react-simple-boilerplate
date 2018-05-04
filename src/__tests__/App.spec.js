import React from 'react'
import expect from 'expect.js'

import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({adapter: new Adapter()});

import List from '../components/list/List'
import TextInput from '../components/TextInput'
import Map from '../components/map/Map'
import App from '../App'

const state = {
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
	routes: [
		{
			from: {
				coordinates: {
					lat: 60.0013716,
					lng: 30.15266680000002
				},
				name: "Лесная ул., 1, Ольгино"
			},
			to: {
				coordinates: {
					lat: 60.039829,
					lng: 30.474531999999954
				},
				name: "Лесная ул., 3, Мурино"
			},
			id: '1',
			line: {}
		}
	]
};

describe('Components: App', () => {
	it('should render two columns, a TextInput, a List and a Map', () => {
		const app = shallow(
			<App {...state} />
		);
		expect(app.find('.column').length).to.be(2);
		expect(app.find(TextInput).length).to.be(1);
		expect(app.find(List).length).to.be(1);
		expect(app.find(Map).length).to.be(1);
	});

});