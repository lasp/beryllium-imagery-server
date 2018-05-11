var path = require("path");
var util = require("../util");

var regex = /^mola_color_N(-?\d\d)_(\d{3})\.png$/;

exports.name = path.basename(module.filename, path.extname(module.filename));

exports.roots = [
	"http://www.mars.asu.edu/data/mola_color/large/"
];

exports.levels = "0-7";

exports.parseFunction = function(filename) {
	var match = regex.exec(filename);
	if( !match ) {
		return { success: false };
	}
	else {
		var lat = parseInt(match[1]);
		var lng = parseInt(match[2]);

		lng = util.normalizeLng(lng);

		return {
			success: true,

			north: lat+30,
			south: lat,
			west: lng,
			east: lng+30
		};
	}
};

exports.files = [
	"mola_color_N-30_000.png", "mola_color_N-30_030.png", "mola_color_N-30_060.png",
	"mola_color_N-30_090.png", "mola_color_N-30_120.png", "mola_color_N-30_150.png",
	"mola_color_N-30_180.png", "mola_color_N-30_210.png", "mola_color_N-30_240.png",
	"mola_color_N-30_270.png", "mola_color_N-30_300.png", "mola_color_N-30_330.png",
	"mola_color_N-60_000.png", "mola_color_N-60_030.png", "mola_color_N-60_060.png",
	"mola_color_N-60_090.png", "mola_color_N-60_120.png", "mola_color_N-60_150.png",
	"mola_color_N-60_180.png", "mola_color_N-60_210.png", "mola_color_N-60_240.png",
	"mola_color_N-60_270.png", "mola_color_N-60_300.png", "mola_color_N-60_330.png",
	"mola_color_N-90_000.png", "mola_color_N-90_030.png", "mola_color_N-90_060.png",
	"mola_color_N-90_090.png", "mola_color_N-90_120.png", "mola_color_N-90_150.png",
	"mola_color_N-90_180.png", "mola_color_N-90_210.png", "mola_color_N-90_240.png",
	"mola_color_N-90_270.png", "mola_color_N-90_300.png", "mola_color_N-90_330.png",
	"mola_color_N00_000.png", "mola_color_N00_030.png", "mola_color_N00_060.png",
	"mola_color_N00_090.png", "mola_color_N00_120.png", "mola_color_N00_150.png",
	"mola_color_N00_180.png", "mola_color_N00_210.png", "mola_color_N00_240.png",
	"mola_color_N00_270.png", "mola_color_N00_300.png", "mola_color_N00_330.png",
	"mola_color_N30_000.png", "mola_color_N30_030.png", "mola_color_N30_060.png",
	"mola_color_N30_090.png", "mola_color_N30_120.png", "mola_color_N30_150.png",
	"mola_color_N30_180.png", "mola_color_N30_210.png", "mola_color_N30_240.png",
	"mola_color_N30_270.png", "mola_color_N30_300.png", "mola_color_N30_330.png",
	"mola_color_N60_000.png", "mola_color_N60_030.png", "mola_color_N60_060.png",
	"mola_color_N60_090.png", "mola_color_N60_120.png", "mola_color_N60_150.png",
	"mola_color_N60_180.png", "mola_color_N60_210.png", "mola_color_N60_240.png",
	"mola_color_N60_270.png", "mola_color_N60_300.png", "mola_color_N60_330.png"
];

