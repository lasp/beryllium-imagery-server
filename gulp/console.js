
function wrap(fn) {
	return function() {
		arguments[0] = "\t" + arguments[0];
		return fn.apply(console, arguments);
	}
}

exports.log = wrap(console.log);
exports.error = wrap(console.error);