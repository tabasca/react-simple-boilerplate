import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import RouteItem from './RouteItem'

class List extends Component {
	render() {
		let list;

		const { waypoints } = this.props;
		const { removeWaypoint, moveWaypoint } = this.props;

		if (waypoints.length) {
			list = <ol className="list">
				{
					waypoints.map( (waypoint, i) => {
						return (
							<RouteItem
								key={waypoint.id}
								index={i}
								id={waypoint.id}
								waypoint={waypoint}
								onDelete={removeWaypoint.bind(this, waypoint)}
								moveWaypoint={moveWaypoint}
								isDragging={false}
							/>
						)
					})
				}
			</ol>
		}

		return (
			<div>
				{list}
			</div>
		);
	}
}

List.propTypes = {
	waypoints: PropTypes.array.isRequired,
	removeWaypoint: PropTypes.func.isRequired,
	moveWaypoint: PropTypes.func.isRequired
};

export default DragDropContext(HTML5Backend)(List);