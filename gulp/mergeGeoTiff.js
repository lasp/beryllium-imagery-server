var gulp = require("gulp");
var path = require("path");
var conf = require("./conf");
var util = require("./util");
var console = require("./console");
var child_process = require("child_process");

gulp.task("mergeMarsViking", ["tiffMarsViking"], function(callback) {
	mergeGeoTiff(
		require("./treeConfigs/mars-viking"),
		callback
	);
});

gulp.task("mergeMarsMolaSr", ["tiffMarsMolaSr"], function(callback) {
	mergeGeoTiff(
		require("./treeConfigs/mars-mola-sr"),
		callback
	);
});

gulp.task("mergeMarsMola", ["tiffMarsMola"], function(callback) {
	mergeGeoTiff(
		require("./treeConfigs/mars-mola"),
		callback
	);
});

function mergeGeoTiff(config, callback) {
	var logPrefix = config.name + ": \t";

	var srcDir = path.join(conf.projRoot, "tiff", config.name);
	var destDir = path.join(conf.projRoot, "tiff-merged");
	util.ensurePathExists(destDir);

	var dest = path.join(destDir, config.name + ".tif");

	var sourceFilesStr = config.files
		.map(function(filename) {
			return '"' + path.join(srcDir, filename.replace(/.png$/, ".tif")) + '"'
		})
		.join(" ");

	var cmd = 'gdal_merge.py -o "{dest}" -of GTiff -co "TILED=YES" {sourceFilesStr}'
		.replace("{dest}", dest)
		.replace("{sourceFilesStr}", sourceFilesStr);

	console.log(logPrefix + cmd);
	child_process.exec(
		cmd,
		function(error, stdout, stderr) {
			if (error) {
				console.error(logPrefix + error);
			}
			callback();
		}
	)
}