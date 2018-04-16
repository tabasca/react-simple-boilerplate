// Speed up calls to hasOwnProperty
const hasOwnProperty = Object.prototype.hasOwnProperty;

class Utils {
	constructor() {

	}

	uuid() {
		let i, random;
		let uuid = '';

		for (i = 0; i < 32; i++) {
			random = Math.random() * 16 | 0;
			if (i === 8 || i === 12 || i === 16 || i === 20) {
				uuid += '-';
			}
			uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
				.toString(16);
		}

		return uuid;
	}

	loadJS(src) {
		let ref = window.document.getElementsByTagName('script')[0];
		let script = window.document.createElement('script');
		script.src = src;
		script.async = true;
		ref.parentNode.insertBefore(script, ref);
	}

	isEmpty(obj) {
		// null and undefined are "empty"
		if (obj == null) return true;

		// Assume if it has a length property with a non-zero value
		// that that property is correct.
		if (obj.length > 0)    return false;
		if (obj.length === 0)  return true;

		// If it isn't an object at this point
		// it is empty, but it can't be anything *but* empty
		// Is it empty?  Depends on your application.
		if (typeof obj !== 'object') return true;

		// Otherwise, does it have any properties of its own?
		// Note that this doesn't handle
		// toString and valueOf enumeration bugs in IE < 9
		for (let key in obj) {
			if (hasOwnProperty.call(obj, key)) return false;
		}

		return true;
	}

	swapIndices(array,index1,index2) {
		const newArray = array.slice();
		newArray[index1] = array[index2];
		newArray[index2] = array[index1];
		return newArray;
	}
}

export default new Utils();