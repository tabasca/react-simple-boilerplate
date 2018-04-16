import React, {Component} from 'react';

import List from './components/list/List.jsx';
import Map from './components/map/Map.jsx';
import TextInput from './components/TextInput'

import Utils from './common/utils'

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			waypoints: [],
			map: {},
			routes: []
		};
	}

	addMarker = (coords) => {
		return new google.maps.Marker({
			position: coords,
			map: this.state.map,
			draggable: true
		});
	}

	removeMarker = marker => {
		marker.setMap(null);
	}

	drawRouteOnMap(startPoint, endPoint) {
		let route = new google.maps.Polyline({
			path: [startPoint, endPoint],
			geodesic: true,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 2
		});

		route.setMap(this.state.map);
		return route;
	}

	updateRoute = (point1, point2) => {
		const { routes, waypoints } = this.state;

		if (routes.length) {
			let newRoutes = routes;
			if (!point2) {
				let updatedCoords = {};
				routes.map( (route, index) => {
					let isStartPointNeedsToBeUpdated = route.from.coordinates === point1.coordinates;
					let isEndPointNeedsToBeUpdated = route.to.coordinates === point1.coordinates;

					if (isStartPointNeedsToBeUpdated || isEndPointNeedsToBeUpdated) {
						waypoints.map ( waypoint => {
							if (point1.id === waypoint.id) {
								updatedCoords = {
									coordinates: waypoint.coordinates,
									name: waypoint.address
								};
							}
						});

						let startPosition = isStartPointNeedsToBeUpdated ? updatedCoords : routes[index].from;
						let endPosition = isEndPointNeedsToBeUpdated ? updatedCoords : routes[index].to;

						route.line.setMap(null);
						let line = this.drawRouteOnMap(startPosition.coordinates, endPosition.coordinates);

						newRoutes = newRoutes.map((route, i) => {
							if (i === index) {
								route.from = startPosition;
								route.to = endPosition;
								route.line = line;
							}
							return route;
						});
					}
				});
			}

			if (point2) {
				routes.map( (route, index) => {
					let startPosition = route.from.coordinates === point1.coordinates ? {coordinates: point2.coordinates, name: point2.address} : route.from.coordinates === point2.coordinates ? {coordinates: point1.coordinates, name: point1.address} : route.from;
					let endPosition = route.to.coordinates === point1.coordinates ? {coordinates: point2.coordinates, name: point2.address} : route.to.coordinates === point2.coordinates ? {coordinates: point1.coordinates, name: point1.address} : route.to;

					if (route.from.coordinates === point1.coordinates || route.from.coordinates === point2.coordinates || route.to.coordinates === point1.coordinates || route.to.coordinates === point2.coordinates) {
						route.line.setMap(null);
						let line = this.drawRouteOnMap(startPosition.coordinates, endPosition.coordinates);

						newRoutes = newRoutes.map((route, i) => {
							if (i === index) {
								route.from = startPosition;
								route.to = endPosition;
								route.line = line;
							}
							return route;
						});
					}

				});
			}

			this.setState(state => ({
				...state,
				routes: newRoutes
			}),
			() => {

			});
		}
	}

	addRoute = (from, to) => {
		let line = this.drawRouteOnMap( from.coordinates, to.coordinates );

		this.setState(state => ({
			...state,
			routes: state.routes.concat({
				id: Utils.uuid(),
				from: {
					coordinates: from.coordinates,
					name: from.name
				},
				to: {
					coordinates: to.coordinates,
					name: to.name
				},
				line: line
			})
		}), () => {

		});
	}

	removeRoute = (coords, waypointPosition) => {
		let counter = 0;
		const { waypoints, routes } = this.state;
		let i = routes.length;

		let newRoutes = routes;

		while (i--) {
			let route = routes[i];
			let routeStartsFromWaypointToDel = route.from.coordinates === coords;
			let routeEndsAtWaypointToDel = route.to.coordinates === coords;

			if (routeStartsFromWaypointToDel || routeEndsAtWaypointToDel) {
				counter++;

				route.line.setMap(null);
				newRoutes = newRoutes.filter((_, index) => index !== i);
			}
		}

		this.setState(state => ({
			...state,
			routes: newRoutes
		}), () => {
			if (waypointPosition !== 0 && waypointPosition !== waypoints.length && counter > 1) {
				let from = {
					coordinates: waypoints[waypointPosition - 1].coordinates,
					name: waypoints[waypointPosition - 1].address
				},
					to = {
					coordinates: waypoints[waypointPosition + 1].coordinates,
					name: waypoints[waypointPosition + 1].address
				};
				this.addRoute(from, to);
			}
		});
	};

	updateCoordinates = (waypointToUpdate) => {
		this.setState(state => ({
			...state,
			waypoints: state.waypoints.map(waypoint => {
				if (waypoint.id === waypointToUpdate.id) {
					waypoint.coordinates.lat = waypointToUpdate.marker.position.lat();
					waypoint.coordinates.lng = waypointToUpdate.marker.position.lng();
				}

				return waypoint;
			})
		}), () => {
			this.updateRoute(waypointToUpdate);
		});
	}

	addWaypoint = waypoint => {
		if (waypoint && waypoint.geometry) {
			const { map, waypoints } = this.state;
			let address = '';
			if (waypoint.address_components) {
				let street = waypoint.address_components[1] && waypoint.address_components[1].short_name || '';
				let house = (waypoint.address_components[0] && waypoint.address_components[0].short_name || '');
				let city = waypoint.address_components[2] && waypoint.address_components[2].short_name || '';

				address = [
					street, house, city
				].join(', ');
			}

			map.setCenter(waypoint.geometry.location);
			// map.setZoom(17);

			let newWaypoint = {
				id: Utils.uuid(),
				address: address,
				marker: this.addMarker(waypoint.geometry.location),
				coordinates: {
					lat: waypoint.geometry.location.lat(),
					lng: waypoint.geometry.location.lng()
				}
			};

			let balloon = new google.maps.InfoWindow({
				content: newWaypoint.address
			});

			let index = waypoints.length;

			if (index > 0) {
				let from = {
						coordinates: waypoints[index - 1].coordinates,
						name: waypoints[index - 1].address
					},
					to = {
						coordinates: newWaypoint.coordinates,
						name: newWaypoint.address
					};
				this.addRoute(from, to);
			}

			this.setState(state => ({
				...state,
				waypoints: state.waypoints.concat(newWaypoint)
			}), () => {
				let waypointPosition = this.state.waypoints.indexOf(newWaypoint);
				newWaypoint.marker.addListener('dragend', () => {
					this.updateCoordinates(this.state.waypoints[waypointPosition])
				});

				newWaypoint.marker.addListener('click', () => {
					balloon.open(map, newWaypoint.marker)
				});
			});
		}
	}

	removeWaypoint = waypointToDel => {
		const { waypoints } = this.state;

		let index = waypoints.indexOf(waypointToDel);
		this.removeMarker(waypointToDel.marker);
		this.removeRoute(waypointToDel.coordinates, index);

		this.setState(state => ({
			...state,
			waypoints: waypoints.filter((_, i) => index !== i)
		}), () => {

		});
	}

	moveWaypoint = (dragIndex, hoverIndex) => {
		this.setState(state => ({
			...state,
			waypoints: Utils.swapIndices(state.waypoints, dragIndex, hoverIndex)
		}), () => {
			this.updateRoute(this.state.waypoints[dragIndex], this.state.waypoints[hoverIndex]);
		});
	}

	onMapInit = (map) => {
		this.setState(state => ({
			...state,
			map: map
		}), () => {

		});
	}

	render() {
		return (
			<div className="app">
				<div className="column">
					<TextInput
						name={'waypointInput'}
						label={'Поиск на Google Картах'}
						hint={'(преимущественно в\u00A0рамках\u00A0СПб)'}
						placeholder="Новая точка маршрута"
						onKeyPress={this.addWaypoint}
						map={this.state.map}
					/>
					<List waypoints={this.state.waypoints} removeWaypoint={this.removeWaypoint} moveWaypoint={this.moveWaypoint}/>
				</div>
				<div className="column">
					<Map onMapInit={this.onMapInit} />
				</div>
			</div>
		);
	}
}


