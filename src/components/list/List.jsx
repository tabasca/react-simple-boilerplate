import React, {Component} from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'


import RouteItem from './RouteItem'

@DragDropContext(HTML5Backend)
export default class List extends Component {
	constructor(props) {
		super(props);

	}

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
								connectDragSource={() => {}}
								connectDropTarget={() => {}}
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

