var gulp        = require('gulp');
var runSequence = require('run-sequence');

var productionTask = function (cb) {
    global.production = true;
    runSequence('stylesComb', 'stylesLint', 'styles', 'scriptsLint', 'scripts' + global.bundler, 'cacheBreaker', cb);
};

gulp.task('production', productionTask);
module.exports = productionTask;
