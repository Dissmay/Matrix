let gulp = require('gulp');
let config = require('../config.js');


gulp.task('copy:fonts', function() {
    return gulp
        .src(config.src.fonts + '/*.{ttf,eot,woff,woff2}')
        .pipe(gulp.dest(config.dest.fonts));
});

gulp.task('copy:rootfiles', function() {
    return gulp
        .src(config.src.root + '/*.*')
        .pipe(gulp.dest(config.dest.root));
});

gulp.task('copy:img', function() {
    return gulp
        .src(config.src.img + '/**/*.*')
        .pipe(gulp.dest(config.dest.img));
});

gulp.task('copy', [
        'copy:img',
        'copy:rootfiles',
        'copy:fonts'
    ]
);


gulp.task('copy:watch', function() {
    gulp.watch(config.src.img+'/*', ['copy:img']);
    gulp.watch(config.src.fonts+'/*', ['copy:fonts']);
});