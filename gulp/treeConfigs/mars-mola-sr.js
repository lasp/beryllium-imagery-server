var path = require("path");
var util = require("../util");

var regex = /^molasr_45([ns])(\d{3})\.png$/;

exports.name = path.basename(module.filename, path.extname(module.filename));

exports.roots = [
	"http://www.mars.asu.edu/data/molasr/large/"
];

exports.levels = "0-5";

exports.parseFunction = function(filename) {
	var match = regex.exec(filename);
	if( !match ) {
		return { success: false };
	}
	else {
		var lat = match[1] === "n" ? 45 : -45;
		var lng = parseInt(match[2]);

		lng = util.normalizeLng(lng);

		return {
			success: true,

			north: lat+45,
			south: lat-45,
			west: lng-45,
			east: lng+45
		};
	}
};

exports.files = [
	"molasr_45n045.png", "molasr_45n135.png", "molasr_45n225.png",
	"molasr_45n315.png", "molasr_45s045.png", "molasr_45s135.png",
	"molasr_45s225.png", "molasr_45s315.png"
];

