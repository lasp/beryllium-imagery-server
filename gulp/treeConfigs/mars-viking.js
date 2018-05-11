var path = require("path");
var util = require("../util");

var regex = /^mars45([ns])(\d{3})\.png$/;

exports.name = path.basename(module.filename, path.extname(module.filename));

exports.roots = [
	"http://www.mars.asu.edu/data/mdim_color/large/"
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
	"mars45n045.png", "mars45n135.png", "mars45n225.png",
	"mars45n315.png", "mars45s045.png", "mars45s135.png",
	"mars45s225.png", "mars45s315.png"
];

