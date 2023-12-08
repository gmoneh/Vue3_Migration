var gulp = require("gulp"),
    gulpif = require('gulp-if'),
    dest = require("gulp-dest"),
    rename = require("gulp-rename"),
    minimist = require("minimist"),
    async = require('async'),
    vinylPaths = require("vinyl-paths"),
    colors = require("ansi-colors"),
    tscompiler = require('typescript'),
    concat = require("gulp-concat"),
    print = require("gulp-print").default,
    htmlmin = require("gulp-htmlmin"),
    uglify = require("gulp-uglify-es").default,
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssurl = require("postcss-url"),
    cssnano = require('gulp-cssnano'),
    del = require("del"),
    log = require("fancy-log"),
    fs = require("fs"),
    path = require("path"),
    glob = require("glob"),
    sass = require("gulp-dart-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    ts = require("gulp-typescript"),
    git = require("gulp-git"),
    //	useTsConfig = require("gulp-use-tsconfig"),
    //	ListStream = require('list-stream'),

    rollup = require('rollup');


let buildconfig = require("./clientbuild.json");
let bundleconfig = buildconfig.bundles;
let modulesconfig = buildconfig.modules;
let modulestyles = buildconfig.styles.modules;
let styleconfig = buildconfig.styles.compile;
let libsconfig = buildconfig.libs;
let environment = process.env.NODE_ENV // Expected "development" or "production";

const tsConfigFile = "tsconfig.json";
var tsProject = ts.createProject(tsConfigFile);

var regex = {
    css: /\.css$/,
    html: /\.(html|htm)$/,
    js: /\.js$/
};

var args = minimist(process.argv.slice(2));

gulp.task('set-dev-node-env', function(done) {
    process.env.NODE_ENV = 'development';
    done();
});

gulp.task('set-prod-node-env', function(done) {
    process.env.NODE_ENV = 'production';
    done();
});

gulp.task('bundle:modules', gulp.series(
        'set-prod-node-env',
        rollup_modules(false)
    )
);
gulp.task('bundle:modules:development', gulp.series(
        'set-dev-node-env',
        rollup_modules(true)
    )
);

gulp.task('bundle:styles', gulp.series(
    gulp.parallel(...compileSassFiles()),
    gulp.parallel(...bundlecss(false))
)
);
gulp.task('bundle:styles:development', gulp.series(
    gulp.parallel(...compileSassFiles()),
    gulp.parallel(...bundlecss(true))
)
);

gulp.task('copylibs', function (done) {
    libsconfig.map(lib => gulp.src(lib.inputFiles).pipe(gulp.dest(lib.outputDirectory)));
    done();
});

gulp.task("compilesass", gulp.parallel(...compileSassFiles()));

gulp.task("minifysass", gulp.parallel(...minifySassFiles()));

gulp.task("bundle:css", gulp.parallel(bundlecss(true)));

gulp.task("min:css", gulp.parallel(bundlecss(false)));

gulp.task("bundle:js", gulp.parallel(...bundlejs(true)));

gulp.task("min:js", gulp.parallel(...bundlejs(false)));


gulp.task("min:html", function (done) {
    getBundles(regex.html).map(function (bundle) {
        return gulp.src(bundle.inputFiles, { base: "." })
            .pipe(concat(bundle.outputFileName))
            .pipe(htmlmin({ collapseWhitespace: true, minifyCSS: true, minifyJS: true }))
            .pipe(gulp.dest("."));
    });
    done();
});

gulp.task("min", gulp.parallel('bundle:js', 'min:js', 'bundle:styles', 'min:html'));

gulp.task("tsc", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest(path.join('.', tsProject.rawConfig.compilerOptions.outDir)));
});

gulp.task("showts", function () {
    return tsProject.src()
        .pipe(print());
});

gulp.task("showcompiledts", function () {
    return getCompiledTsFiles()
        .pipe(print());
});


gulp.task("clean:bundles", function (done) {
    let files = bundleconfig.map(function (bundle) {
        return bundle.outputFileName;
    });

    let minFiles = bundleconfig.map(function (bundle) {
        return addMinExtension(bundle.outputFileName);
    });

    let mapFiles = bundleconfig.map(function (bundle) {
        return addMapExtension(bundle.outputFileName);
    });

    files = files.concat(minFiles, mapFiles);

    del(files);
    done();
});


gulp.task("clean:modules", (done) => {
    clean_modules();
    done();
});

gulp.task("clean:css", function (done) {
    var allFiles = getAllSassFiles();

    var files = allFiles.map(function (file) {
        return file.outputFile;
    });

    var minFiles = allFiles.map(function (file) {
        return file.outputFileMinified;
    });

    var mapFiles = allFiles.map(function (file) {
        return file.outputFileMap;
    });

    var minmapFiles = allFiles.map(function (file) {
        return file.outputFileMapMinified;
    });

    files = files.concat(minFiles).concat(mapFiles).concat(minmapFiles).concat([modulestyles]);

    del(files);

    done();
});

gulp.task("clean:ts", function (done) {
    return getCompiledTsFiles().pipe(vinylPaths(path => {
        return new Promise((resolve, reject) => {
            Promise.all(del(path), del(path + '.map'))
                .then(() => resolve())
                .catch(() => reject());
        });
    }))
});

gulp.task("clean", gulp.parallel('clean:bundles', 'clean:modules', 'clean:css', 'clean:ts'));

gulp.task("deepclean", gulp.parallel("clean", function (done) {
    del("bin");
    del("obj");
    del("wwwroot/bundles");
    del("wwwroot/scripts");
    del("wwwroot/styles");
    /* TODO: add the appropriate subdirectories of wwwroot/libs (some are source controlled, so can't do all of them) */
    done();
}));


gulp.task("build:production", gulp.series('copylibs', 'tsc', 'bundle:modules', 'min'));
gulp.task("build:development", gulp.series('copylibs', 'tsc', 'bundle:modules:development', 'bundle:styles:development', 'bundle:js'));
gulp.task("default", gulp.series("build:production"));


gulp.task("watch", function () {
    getBundles(regex.js).forEach(function (bundle) {
        gulp.watch(bundle.inputFiles, ["min:js"]);
    });

    getBundles(regex.css).forEach(function (bundle) {
        gulp.watch(bundle.inputFiles, ["min:css"]);
    });

    getBundles(regex.html).forEach(function (bundle) {
        gulp.watch(bundle.inputFiles, ["min:html"]);
    });
});


function getAllSassFiles() {
    var allFiles = [];

    styleconfig.map(function (spec) {
        var files = glob.sync(spec.inputFile);
        files.forEach(function (value, index, arr) {
            var baseName = path.basename(value, path.extname(value));
            if (baseName.substr(0, 1) !== "_") {
                var basePath = path.join(spec.outputPath, baseName);
                allFiles.push({
                    "inputFile": value,
                    "outputPath": spec.outputPath,
                    "outputFile": basePath + '.css',
                    "outputFileMinified": basePath + '.min.css',
                    "outputFileMap": basePath + '.css.map',
                    "outputFileMapMinified": basePath + 'min.css.map'
                });
            }
        });
    });

    return allFiles;
}

function compileSassFiles() {
    let files = getAllSassFiles();

    const tasks = files.map(function (file) {
        function compileSassFile() {
            return gulp.src(file.inputFile)
                .pipe(sourcemaps.init())
                .pipe(sass().on('error', sass.logError))
                .pipe(postcss([
                    autoprefixer()
                ]))
                .pipe(dest(path.dirname(file.outputFile), {
                    ext: path.extname(file.outputFile),
                    basename: path.basename(file.outputFile)
                }))
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest('.'));
        }

        compileSassFile.displayName = 'Compile ' + file.inputFile;
        return compileSassFile;
    });

    return tasks;
}

function minifySassFiles() {
    let files = getAllSassFiles();

    const tasks = files.map(function (file) {
        function minifyFile() {
            return gulp.src(file.inputFile)
                .pipe(sourcemaps.init())
                .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
                .pipe(dest(path.dirname(file.outputFileMinified), {
                    ext: path.extname(file.outputFileMinified),
                    basename: path.basename(file.outputFileMinified)
                }))
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest('.'));
        }

        minifyFile.displayName = 'Minify ' + file.inputFile;
        return minifyFile;
    });

    return tasks;
}

function bundlecss(debug) {
    let bundles = getBundles(regex.css);
    const tasks = bundles.map((bundle) => {
        function createBundle() {
            return gulp.src(bundle.inputFiles, { base: "." })
                .pipe(gulpif(debug, sourcemaps.init()))
                //.pipe(rebase({ root: path.dirname(bundle.outputFileName) }))
                .pipe(postcss([
                    cssurl({ url: 'rebase' })
                ],
                    { to: bundle.outputFileName }))
                .pipe(concat(debug ? bundle.outputFileName : addMinExtension(bundle.outputFileName)))
                .pipe(gulpif(debug, sourcemaps.write('.')))
                .pipe(gulpif(!debug, cssnano()))
                .pipe(gulp.dest("."));
        }
        createBundle.displayName = 'Create bundle ' + bundle.outputFileName;
        return createBundle;
    });

    return tasks;
}


function bundlejs(debug) {
    let bundles = getBundles(regex.js)
    const tasks = bundles.map((bundle) => {
        function createBundle() {
            let bundleName = debug ? bundle.outputFileName : addMinExtension(bundle.outputFileName);
            return gulp.src(bundle.inputFiles, { base: "." })
                .pipe(concat(bundleName))
                .pipe(gulpif(!debug, uglify()))
                .on('error', function (err) { log(colors.red('[Error]'), err.toString()); })
                .pipe(gulp.dest("."));
        }
        createBundle.displayName = 'Create bundle ' + bundle.outputFileName;
        return createBundle;
    });
    return tasks;
}

function getCompiledTsFiles() {
    return tsProject.src()
        .pipe(rename(function (filepath) {
            filepath.dirname = path.join(tsProject.rawConfig.compilerOptions.outDir, filepath.dirname);
            filepath.extname = ".js";
        }));
}

function getBundles(regexPattern) {
    return bundleconfig.filter(function (bundle) {
        return regexPattern.test(bundle.outputFileName);
    });
}

function addMinExtension(value) {
    var ext = path.extname(value);
    return value.replace(ext, '.min'.concat(ext));
}

function addMapExtension(value) {
    var ext = path.extname(value);
    return value.replace(ext, ext.concat(".map"));
}

function parseCompilerConfigItem(item) {
    if (!item || !item.inputFile || !item.outputFile) {
        let invalidItem = (item && item.inputFile) || 'item';
        log.warn("Ignoring invalid " + invalidItem + ' in ' + compilerConfigFilePath);
        return null;
    }

    return {
        'inputFile': item.inputFile,
        'outputFile': item.outputFile,
        'outputFileMinified': addMinExtension(item.outputFile)
    };
}

function compileFile(file, minified) {
    let outputStyle = minified ? 'compressed' : 'expanded';
    let sourceMap = minified;
    let sourceMapEmbed = !minified;
    let outputFileName = minified ? file.outputFileMinified : file.outputFile;

    log.info('Starting render of: ' + file.inputFile);
    var result = sass.renderSync({
        file: file.inputFile,
        outputStyle: outputStyle,
        outFile: outputFileName,
        sourceMap: sourceMap,
        sourceMapEmbed: sourceMapEmbed
    });

    if (result.error) {
        let errorToLog = result.error.formatted || result.error;
        log.error(errorToLog);
    }
    else {
        let outputFilePath = path.resolve(__dirname, outputFileName);
        let compiledMessage = 'Saved compiled file ' + outputFileName;
        saveFile(result.css.toString(), outputFilePath, compiledMessage);

        if (result.map) {
            let mapFileName = outputFileName + '.map';
            let savedMessage = 'Saved map file ' + mapFileName;
            saveFile(result.map.toString(), mapFileName, savedMessage);
        }
    }
    log.info('Finished render of: ' + file.inputFile);
}

function saveFile(dataToSave, filePath, message, callback) {
    fs.unlink(filePath, (err) => {

        if (err && err.code !== 'ENOENT')
            throw err;

        let options = { flag: 'w' };
        fs.writeFile(filePath, dataToSave, options, (err) => {
            if (err)
                log.error(err);
            else {
                log.info(message);
                callback && callback();
            }
        });
    });
}


function clean_modules() {
    var moduleBundles = [
        'wwwroot/bundles/*-*.js',
        'wwwroot/bundles/*-*.js.map',
        'wwwroot/bundles/*.bundle.js',
        'wwwroot/bundles/*.bundle.js.map'
    ];

    del(moduleBundles);
}

function getTsPathAliases() {
    let tspaths = tsConfigFileSrc.compilerOptions.paths;
    let pathKeys = Object.keys(tspaths);
    let newPaths = pathKeys.reduce((acc, curr) => { let currk = curr.replace('/*', ''), newitem = {}; newitem[currk] = path.resolve('./' + tspaths[curr][0].replace('/*', '')); return {...acc, ...newitem }}, {});
    return newPaths;
}


function rollup_modules(debug) {
    return () => {
        let requireesm = require('esm')(module);
        let rollupConfigs = requireesm("./rollup.config");
        let rollupConfig = rollupConfigs.default[0];
        clean_modules();
        return rollup.rollup({
            input: rollupConfig.input,
            plugins: rollupConfig.plugins
        })
        .then(bundle => {
            return bundle.write(rollupConfig.output)
        });
    }
}
