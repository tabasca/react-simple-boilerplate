import React, {Component} from 'react'
import { findDOMNode } from 'react-dom'
import { common } from '../../common/common'

import Utils from '../../common/utils'

export default class Map extends Component {
	componentDidMount() {
		window.loadMap = this.loadMap;
		Utils.loadJS(`https://maps.googleapis.com/maps/api/js?key=${common.GOOGLE_API_KEY}&libraries=places&callback=loadMap`);
	}

	loadMap = () => {
		this.maps = google.maps;

		const mapRef = this.refs.map;
		const node = findDOMNode(mapRef);

		let zoom = 10;
		let lat = common.MAP_BOUNDS.lat;
		let lng = common.MAP_BOUNDS.lng;
		const center = new this.maps.LatLng(lat, lng);
		const mapConfig = Object.assign({}, {
			center: center,
			zoom: zoom
		});
		this.map = new this.maps.Map(node, mapConfig);

		this.props.onMapInit(this.map);
	}

	render() {
		return (
			<div className="map">
				<div ref="map"></div>
			</div>
		);
	}
}
