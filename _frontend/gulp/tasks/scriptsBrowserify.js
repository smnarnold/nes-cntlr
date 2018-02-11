var gulp         = require('gulp');
var assign       = require('lodash.assign');
var babelify     = require('babelify');
var browserify   = require('browserify');
var browserSync  = require('browser-sync');
var buffer       = require('vinyl-buffer');
var gulpif       = require('gulp-if');
var handleErrors = require('../lib/handleErrors');
var path         = require('path');
var sizereport   = require('gulp-sizereport');
var source       = require('vinyl-source-stream');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');
var watchify     = require('watchify');

var paths = {
    src: path.join(global.paths.assets.src, 'js/boot.js'),
    dest: path.join(global.paths.assets.dest, 'js'),
};

var b = null;

var scriptsBrowserifyTask = function () {

    // add custom browserify options here
    var customOptions = {
        entries: [paths.src],
        debug: !global.production,
    };

    var options = assign({}, watchify.args, customOptions);
    b = global.production ? browserify(options) : watchify(browserify(options));

    // add transformations here
    b.transform('babelify', {presets: ['es2015']});

    b.on('update', bundle); // on any dep update, runs the bundler

    bundle();
};

function bundle() {
    return b.bundle()
        .on('error', handleErrors) // log errors if they happen
        .pipe(source('boot.js'))
        // optional, remove if you don't need to buffer file contents
        .pipe(buffer())
        // optional, remove if you dont want sourcemaps
        .pipe(gulpif(!global.production, sourcemaps.init({loadMaps: true}))) // loads map from browserify file
        .pipe(gulpif(global.production, uglify()))
        // Add transformation tasks to the pipeline here.
        .pipe(gulpif(!global.production, sourcemaps.write())) // writes .map file
        .pipe(sizereport({gzip: true, total: false}))
        .pipe(gulp.dest(paths.dest))
        .pipe(gulpif(!global.production, browserSync.stream()));
}


gulp.task('scriptsBrowserify', scriptsBrowserifyTask);
module.exports = scriptsBrowserifyTask;
