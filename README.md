# Beryllium Imagery Server Generator

### Contacts

* **Primary Dev:** Brian Putnam

This project is an internal tool for the Maven 3D project. Alex DeWolfe is the primary person for
that project, but I doubt she's ever heard of this tool.

### Beryllium Imagery Server Generator Summary

This project automates the process of generating the map tiles for the
[beryllium-maven](https://github.com/lasp/beryllium-maven.git) project.
It downloads the raw images from [ASU](http://www.mars.asu.edu/data/) and processes them into the
[Tile Map Service](https://en.wikipedia.org/wiki/Tile_Map_Service)
([spec](http://wiki.osgeo.org/wiki/Tile_Map_Service_Specification)) format that is required by
beryllium-maven. The processing is automated via gulp, but most of the actual work is done by
[GDAL](http://www.gdal.org/). The generated TMS files will live in the `trees`
folder. You are responsible for uploading that somewhere useful after this
project has created it (e.g. to the Media Server).

At the time of this writing, this project supports 3 different image sets for
Mars; mars-viking, mars-mola, and mars-mola-sr. Both mars-viking and
mars-mola-sr are reasonably small, a few hundred MB. The mars-mola dataset,
however is quite large; about 2GB to download and during the processing step
it creates a 12GB file (I have no idea why the size increases like that).

### Related Projects

* [beryllium-maven](https://github.com/lasp/beryllium-maven.git)

### Production URLs

This project doesn't live in prod per se, but the images it creates are typically available here:

https://lasp.colorado.edu/media/projects/tms_trees/

Examples (since plain directories return a 403):

* https://lasp.colorado.edu/media/projects/tms_trees/mars-viking/tilemapresource.xml
* https://lasp.colorado.edu/media/projects/tms_trees/mars-viking/2/1/1.png

### Necessary Permissions

You may need permissions to publish newly-generated images to the Media Server. I don't recall
exactly how to set that up, but Steve Roughton and Mike Bryant were the ones who helped me get set
up there.

### Architecture

The custom code for this project lives entirely in the gulp build system, which contains tasks to
automate the various steps needed to generate the TMS tiles. See 'Build System' for details.

### Build System

This project uses gulp to build several different image sets. Each image set has the same for gulp
tasks available, suffixed by the image set name. For example, for the 'MarsViking' image set the
available tasks are `downloadMarsViking`, `tiffMarsViking`, `mergeMarsViking`, and `treeMarsViking`.
The tasks do roughly this:

**downloadFoo:** downloads the Foo dataset as specified in
`gulp/treeConfigs/Foo.js`. Files will be downloaded to `./raw/Foo/`

**tiffFoo:** converts the png files that `downloadFoo` downloaded into GeoTiff
format (Tiff with some extra metadata for GIS, like lat/lng borders for the
image). The lat/lng borders are parsed from the filename using `parseFunction`
from `gulp/treeConfigs/Foo.js`. Generated tif files will live in `./tiff/Foo/`

**mergeFoo:** merge all of the tif files from `tiffFoo` into a single
(possibly gargantuan) tif file. The mega-tiff will be named
`./tiff-merged/Foo.tif`.

**treeFoo:** split the mega-tiff from `mergeFoo` into a TMS-formatted folder
structure. The number of levels generated is controlled via the `levels`
variable in `gulp/treeConfigs/Foo.js` (e.g. `"0-5"` is pretty common). The
generated folder will be `./trees/Foo/`.

_**IMPORTANT NOTE:**_ None of these tasks clean up after (or before) themselves.
You're responsible for running (for example) `rm -rf tiff` before you re-run
any of the `tiffFoo` tasks.

##### Task Cheatsheet

Arranged hierarchically by task dependency:

* *default* (just run `gulp`)
	* `treeAll` (run `gulp treeAll`)
		* `treeMarsMola` (this one takes a while)
			* `mergeMarsMola`
				* `tiffMarsMola`
					* `downloadMarsMola` (this one takes a while)
		* `treeMarsMolaSr`
			* `mergeMarsMolaSr`
				* `tiffMarsMolaSr`
					* `downloadMarsMolaSr`
		* `treeMarsViking`
			* `mergeMarsViking`
				* `tiffMarsViking`
					* `downloadMarsViking`

### Running Beryllium Imagery Server Generator Locally

1. **Clone this repo**
2. **`npm install`:** If you've already got `node` and `npm` installed you can just run `npm install`
	in the project root. If not, you'll have to install them first.
3. **Install GDAL:** If you're on an Ubuntu-flavored linux variant (highly recommended for this
	project), just run:

	```shell
	sudo apt-get update
	sudo apt-get install gdal-bin python-gdal python3-gdal
	```

	On other linux variants there are probably similar commands you can run to get
	GDAL from a package manager (e.g. yum).

	If you're feeling adventurous (or masochistic), see below for some possibly-broken hints at how
	to compile GDAL from source.

	Currently, the gulp scripts rely on the GDAL programs being accessible from the
	default PATH variable. If you'd prefer to install GDAL in some other way and
	then update the scripts to reference that version, it probably wouldn't take
	too much work.
4. **Run Gulp:** To "just do everything" run `gulp` with no parameters. To do something more
	specific, run the appropriate task. See 'Build System' and 'Task Cheatsheet' for more details.

#### Optional: Compile GDAL from source (possibly broken?)

This isn't really recommended if you can use a package manager like `apt` or `yum`, but I spent a
fair amount of time trying to compile this from source at first, and figured I should save my
progress here. I'm not entirely sure it worked; there was a lot of stuff that
was breaking in those days and I don't know whether this install process was to
blame or if I was just using it wrong (both are likely).

```bash
sudo apt-get install libproj-dev build-essential python-dev

./configure --with-python
make # Note: this step takes a while (about 10 min on my linux vm)
sudo make install

export LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH
```

##### Common error messages

**"C compiler cannot create executables" OR
"crt1.o: No such file: No such file or directory"**

You need to have glibc-devel installed. On Ubuntu, run
`apt-get install build-essential`.

**"error while loading shared libraries: libgdal.so.1: cannot open
shared object file: No such file or directory"**

You need to add the shared library folder to LD_LIBRARY_PATH. Run:

```bash
export LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH
```

**Something about "couldn't find Python.h"**

You need to install the python-dev libraries. On Ubuntu, run
`apt-get install python-dev`

##### Project Dependencies

* [GDAL](http://www.gdal.org/)
* Python
* Node/npm/gulp

##### Special DevEnv Issues

* I've had the most luck with Ubuntu-flavored linux VMs.

### Deploying Beryllium Imagery Server Generator

This project is not directly deployed itself, however the generated TMS tiles/directories are
typically deployed to the LASP Media Server (see 'Production URLs').

##### Requirements

See Deployment Requirements for the
[beryllium-maven project](https://github.com/lasp/beryllium-maven.git)

### FAQs and Help

For questions please contact LASP Web Team

##### Beryllium Imagery Server Generator-specific common issues, gotchas

* Occasionally ASU will change the directory structure of their images. Since that's where we
	download our raw images from, you may need to fix the urls in `gulp/treeConfigs` from time to
	time.

#### Copyright
Copyright 2018 Regents of the University of Colorado. All rights reserved.

#### Terms of Use
Commercial use of this project is forbidden due to the terms set forth by Highstock.
