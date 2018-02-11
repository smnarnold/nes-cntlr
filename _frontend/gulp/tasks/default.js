var gulp        = require('gulp');
var runSequence = require('run-sequence');

var defaultTask = function (cb) {
    global.production = false;
    runSequence('stylesComb', 'stylesLint', 'styles', 'scripts' + global.bundler, 'watch', cb);
};

gulp.task('default', defaultTask);
module.exports = defaultTask;
