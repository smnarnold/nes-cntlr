var gulp       = require('gulp');
var sizereport = require('gulp-sizereport');
var path       = require('path');

var paths = {
    src: path.join(global.paths.assets.dest, '**/*'),
};

var sizereportTask = function () {
    return gulp.src(paths.src)
        .pipe(sizereport({
            gzip: true
        }));
};

gulp.task('sizereport', sizereportTask);
module.exports = sizereportTask;