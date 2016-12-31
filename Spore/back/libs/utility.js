function removeUndefined(obj) {
	for (var property in obj) {
		if (typeof obj[property] === 'undefined') {
			delete obj[property];
		}
	}
}

module.exports.removeUndefined = removeUndefined;
