var gulp        = require('gulp');
var browserSync = require('browser-sync');

var browserSyncTask = function () {
    browserSync.init({
        open: false,
        // proxy: "dev.local",
        server: {
            baseDir: '../'
        },
    });
};

gulp.task('browserSync', browserSyncTask);
module.exports = browserSyncTask;
