function removeUndefined(obj) {
	for (let property in obj) {
		if (obj.hasOwnProperty(property) && typeof obj[property] === 'undefined') {
			delete obj[property];
		}
	}
}

module.exports.removeUndefined = removeUndefined;
