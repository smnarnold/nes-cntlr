var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var path        = require('path');
var reload      = browserSync.reload;
var runSequence = require('run-sequence');
var watch       = require('gulp-watch');

var watchTask = function () {
    var fileTypes = [
        {
            folder: 'scss',
            tasks: ['stylesLint', 'styles'],
            extensions: ['scss']
        }
    ];

    // add js files only for webpack (browserify is setup with watchify)
    if (global.bundler === 'Webpack') {
        fileTypes.push({
            folder: 'js',
            tasks: ['scriptsLint', 'scripts', 'reload'],
            extensions: ['js'],
        });
    }

    fileTypes.forEach(function (fileType) {
        var paths = {
            src: [
                path.join(global.paths.assets.src, fileType.folder, '**/*.{' + fileType.extensions.join(',') + '}'),
                '!**/*___jb_tmp___'
            ]
        };

        watch(paths.src, function () {
            runSequence.apply(null, fileType.tasks);
        }).on('change', reload);
    })
};

gulp.task('watch', ['browserSync'], watchTask);
module.exports = watchTask;
