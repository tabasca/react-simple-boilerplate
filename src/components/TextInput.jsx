import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { common } from '../common/common'
import Utils from '../common/utils'

class TextInput extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isAutocompleteInitialized: false
		}
	}

	componentDidUpdate() {
		if (!Utils.isEmpty(this.props.map) && !this.state.isAutocompleteInitialized) {
			this.addAutocomplete();
		}
	}

	addAutocomplete() {
		let that = this;

		let maps = google.maps;
		let defaultBounds = new maps.LatLngBounds(
			new maps.LatLng(common.MAP_BOUNDS.lat, common.MAP_BOUNDS.lng)
		);

		let options = {
			bounds: defaultBounds,
			types: ['address']
		};
		let autocomplete = new maps.places.Autocomplete(this.refs.routeInput, options);

		autocomplete.addListener('place_changed', function(evt) {
			let place = autocomplete.getPlace();

			if (!place.geometry) {
				window.alert("No details available for input: '" + place.name + "'");
				return false;
			}

			that.props.onKeyPress(place);
			that.refs.routeInput.value = '';
		});

		this.setState(state => ({
			...state,
			isAutocompleteInitialized: true
		}), () => {

		});
	}

	render() {
		const {name, label, hint, onKeyPress, placeholder} = this.props;

		return (
			<div className="autocomplete">
				<label className="autocomplete__label">{label}
					<div className="autocomplete__hint">{hint}</div>
					<input
						type="text"
						name={name}
						className="autocomplete__input"
						placeholder={placeholder}
						onKeyPress={onKeyPress}
						ref="routeInput"
					/>
				</label>
			</div>
		);
	}
}

TextInput.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	hint: PropTypes.string,
	onKeyPress: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	map: PropTypes.object.isRequired
};

export default TextInput;