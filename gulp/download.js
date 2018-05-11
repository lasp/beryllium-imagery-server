var async = require("async");
var request = require("request");
var gulp = require("gulp");
var conf = require("./conf");
var fse = require("fs-extra");
var path = require("path");
var Rsync = require("rsync");
var console = require("./console");
var util = require("./util");

var MAX_ASYNC_DOWNLOADS = 2;

gulp.task("downloadAll", ["downloadMarsViking", "downloadMarsMola", "downloadMarsMolaSr"]);

gulp.task("downloadMarsViking", function(callback) {
	downloadAll(
		require("./treeConfigs/mars-viking"),
		function() {
			callback();
		});
});

gulp.task("downloadMarsMola", function(callback) {
	downloadAll(
		require("./treeConfigs/mars-mola"),
		function() {
			callback();
		});
});

gulp.task("downloadMarsMolaSr", function(callback) {
	downloadAll(
		require("./treeConfigs/mars-mola-sr"),
		function() {
			callback();
		});
});

function downloadAll(config, callback) {
	var destDir = path.join(conf.projRoot, "raw", config.name) + "/";
	util.ensurePathExists(destDir);

	for(var i=0; i<config.roots.length; i++) {
		var root = config.roots[i];

		console.log("Trying download root:", root);

		try {
			if (/^https?:\/\//.test(root)) {
				downloadAllHttp(config, destDir, root, callback);
			}
			else if(/^ssh:\/\//.test(root)) {
				downloadAllSsh(config, destDir, root, callback);
			}
			break;
		}
		catch (e) {
			console.log("Skipping root: " + e);
			continue;
		}
	}
}

function downloadAllHttp(config, destDir, root, callback) {

	var tempDir = path.join(conf.projRoot, "tmp", "downloads-http", config.name);
	util.ensurePathExists(tempDir);

	async.eachLimit(
		config.files,
		MAX_ASYNC_DOWNLOADS,
		function(file, callback) {
			var url = root + file;
			var tempFile = path.join(tempDir, file);
			var destFile = path.join(destDir, file);

			if (fse.existsSync(destFile)) {
				async.setImmediate(function() {
					console.log("Skipping download of " + file + " (already exists)")
					callback();
				});
			}
			else {
				console.log("Starting download of " + file);
				request.get(url)
					.pipe(fse.createWriteStream(tempFile))
					.on("finish", function() {
						fse.copySync(tempFile, destFile);
						fse.unlink(tempFile);
						console.log("Finished downloading " + file);
						callback();
					});
			}
		},
		callback
	);
}

var SSH_URL_PARSER = /ssh:\/\/([^:\/]*)(.*)/;

function ensureTrailingSlash(path) {
	return /\/$/.test(path)
		? path
		: path + "/";
}

function downloadAllSsh(config, destDir, root, callback) {
	root = root.replace(/^ssh:\/\//, '');

	root = ensureTrailingSlash(root);
	destDir = ensureTrailingSlash(destDir);

	var logPrefix = config.name + ": \t";

	var rsync = new Rsync()
		.shell('ssh')
		.flags('av') // no need for "z" (compress) flag - images are already pretty compressed
		.source(root)
		.destination(destDir);

	var quitting = function() {
		if (rsyncPid) {
			rsyncPid.kill();
		}
		process.exit();
	};
	process.on("SIGINT", quitting);
	process.on("SIGTERM", quitting);
	process.on("exit", quitting);

	console.log(logPrefix + rsync.command());
	var rsyncPid = rsync.execute(
		function(error, code, cmd) {
			if (error) {
				console.error(logPrefix + error);
			}
			callback();
		},
		function(msgBuf) { console.log(logPrefix + msgBuf.toString().trim()); },
		function(errBuf) { console.error(logPrefix + errBuf.toString().trim()); }
	);
}

