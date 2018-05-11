var conf = require("./conf");
var path = require("path");
var child_process = require("child_process");
var console = require("./console");
var util = require("./util");
var gulp = require("gulp");

gulp.task("tiffMarsViking", ["downloadMarsViking"], function(callback) {
	png2GeoTiff(
		require("./treeConfigs/mars-viking"),
		callback
	);
});

gulp.task("tiffMarsMolaSr", ["downloadMarsMolaSr"], function(callback) {
	png2GeoTiff(
		require("./treeConfigs/mars-mola-sr"),
		callback
	);
});

gulp.task("tiffMarsMola", ["downloadMarsMola"], function(callback) {
	png2GeoTiff(
		require("./treeConfigs/mars-mola"),
		callback
	);
});

function png2GeoTiff(config, callback) {
	var src = path.join(conf.projRoot, "raw", config.name);
	var dest = path.join(conf.projRoot, "tiff", config.name);
	util.ensurePathExists(dest);

	var parsedArr = config.files
		.map(function(filename) {
			var bounds = config.parseFunction(filename);
			if (!bounds.success) { throw "Failed to parse filename '" + filename + "'"; }
			return {
				filename: filename,
				bounds: bounds
			};
		});

	var numRunningProcesses = 0;
	parsedArr.forEach(function(parsed) {

		var srcFile = path.join(src, parsed.filename);
		var destFile = path.join(dest, parsed.filename)
			.replace(path.extname(srcFile), '.tif');

		var cmd = "gdal_translate -of GTiff -a_srs EPSG:4326 -a_ullr {west} {north} {east} {south} {srcFile} {destFile}"
			.replace("{west}", parsed.bounds.west)
			.replace("{north}", parsed.bounds.north)
			.replace("{east}", parsed.bounds.east)
			.replace("{south}", parsed.bounds.south)
			.replace("{srcFile}", srcFile)
			.replace("{destFile}", destFile);

		var logPrefix = config.name + " (" + parsed.filename + "): ";
		console.log(logPrefix + cmd);
		var child = child_process
			.exec(cmd, function(error, stdout, stderr) {
				if (error) {
					console.error(logPrefix + error);
				}
				console.log(logPrefix + "Complete.");
				numRunningProcesses--;
				if (numRunningProcesses === 0) {
					callback();
				}
			})
		numRunningProcesses++;
	});
}
