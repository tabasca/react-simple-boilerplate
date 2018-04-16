import React, { Component, PropTypes } from 'react'

import { DragSource, DropTarget } from 'react-dnd'

const routeSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index,
		}
	}
};

const routeTarget = {
	drop(props, monitor) {
		const dragIndex = monitor.getItem().index;
		const hoverIndex = props.index;

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return
		}

		props.moveWaypoint(dragIndex, hoverIndex);
		monitor.getItem().index = hoverIndex;
	}
};

@DropTarget('route', routeTarget, connect => ({
	connectDropTarget: connect.dropTarget(),
}))
@DragSource('route', routeSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
}))

class RouteItem extends Component {
	render() {
		const {
			waypoint,
			onDelete,
			isDragging,
			connectDragSource,
			connectDropTarget,
		} = this.props;

		const opacity = isDragging ? 0 : 1;

		return connectDragSource(
			connectDropTarget(<li className="list__item" style={{ opacity }}>
				<span className="list__text">{waypoint.address}</span>
				<span className="list__del" onClick={onDelete}>Delete</span>
			</li>)
		);
	}
}

RouteItem.propTypes = {
	waypoint: PropTypes.object.isRequired,
	onDelete: PropTypes.func.isRequired,
	moveWaypoint: PropTypes.func.isRequired,
	connectDragSource: PropTypes.func.isRequired,
	connectDropTarget: PropTypes.func.isRequired,
	isDragging: PropTypes.bool.isRequired
};

export default RouteItem;