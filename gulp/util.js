var fse = require("fs-extra");
var path = require("path");

ensurePathExists = function(pathStr) {
	if (fse.existsSync(pathStr)) {
		return;
	}
	else {
		var parent = path.resolve(path.join(pathStr, '..'));
		ensurePathExists(parent);
		fse.mkdirSync(pathStr);
	}
}
exports.ensurePathExists = ensurePathExists;

exports.normalizeLng = function(lng) {
	if (lng >=180) {
		while (lng >= 180) {
			lng -= 360;
		}
	}
	else if (lng < 0) {
		while (lng < 0) {
			lng += 360;
		}
	}
	return lng;
}