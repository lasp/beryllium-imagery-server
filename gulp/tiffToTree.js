var gulp = require("gulp");
var path = require("path");
var conf = require("./conf");
var fse = require("fs-extra");
var util = require("./util");
var child_process = require("child_process");
var console = require("./console");

gulp.task("treeAll", ["treeMarsViking", "treeMarsMola", "treeMarsMolaSr"]);

gulp.task("treeMarsViking", ["mergeMarsViking"], function(callback) {
	tiffToTree(
		require("./treeConfigs/mars-viking"),
		callback
	);
});

gulp.task("treeMarsMolaSr", ["mergeMarsMolaSr"], function(callback) {
	tiffToTree(
		require("./treeConfigs/mars-mola-sr"),
		callback
	);
});

gulp.task("treeMarsMola", ["mergeMarsMola"], function(callback) {
	tiffToTree(
		require("./treeConfigs/mars-mola"),
		callback
	);
});

function tiffToTree(config, callback) {
	var logPrefix = config.name + ": ";

	var srcTiff = path.join(conf.projRoot, "tiff-merged", config.name + ".tif");
	var destDir = path.join(conf.projRoot, "trees", config.name);

	util.ensurePathExists(destDir);
	fse.emptyDirSync(destDir);

	// NOTE: we're using a local version of gdal2tiles.py because the newer version
	// in some distributions appears to be broken.
	var cmd = 'python {projRoot}/gdal2tiles.py -z {levels} -w none "{srcTiff}" "{destDir}"'
		.replace("{projRoot}", conf.projRoot)
		.replace("{levels}", config.levels)
		.replace("{srcTiff}", srcTiff)
		.replace("{destDir}", destDir);

	console.log(logPrefix + cmd);
	var child = child_process.exec(
		cmd,
		function(error, stdout, stderr) {
			if (error) {
				console.error(logPrefix + error);
			}
			callback();
		}
	);
}