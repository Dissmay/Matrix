let gulp = require('gulp');
let runSequence = require('run-sequence');
let config      = require('../config');

gulp.task('default', function(cb){
	runSequence(
		'build:dev',
        'watch',
        'server',
        cb
	);
});