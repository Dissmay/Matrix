let gulp         = require('gulp');
let less         = require('gulp-less');
let cleanCSS     = require('gulp-clean-css');
let gcmq         = require('gulp-group-css-media-queries');
let sourcemaps   = require('gulp-sourcemaps');
let autoprefixer = require('gulp-autoprefixer');
let plumber      = require('gulp-plumber');
let config       = require('../config');


gulp.task('less', function(){
	if(!config.production){
		gulp.src(config.src.precss + '/*.less')
			.pipe(plumber({
	            errorHandler: config.errorHandler
	        }))
			.pipe(less())
			.pipe(gcmq())
			.pipe(sourcemaps.init())
			.pipe(autoprefixer({
	            browsers: ['> 0.01%'],
	            cascade: false
	       		}))
			.pipe(cleanCSS({
				level: 2
			}))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(config.dest.css));
	} else{
		gulp.src(config.src.precss + '/*.less')
			.pipe(plumber({
	            errorHandler: config.errorHandler
	        }))
			.pipe(less())
			.pipe(gcmq())
			.pipe(autoprefixer({
	            browsers: ['> 0.01%'],
	            cascade: false
	       		}))
			.pipe(cleanCSS({
				level: 2
			}))
			.pipe(gulp.dest(config.dest.css));
	}
});

gulp.task('less:watch', function() {
    gulp.watch(config.src.precss + '/**/*.less', ['less']);
});