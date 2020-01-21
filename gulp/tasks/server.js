let gulp = require('gulp');
let server = require('browser-sync').create();
let util   = require('gulp-util');
let config = require('../config');

gulp.task('server', function() {
    server.init({
        server: {
            baseDir: !config.production ? [config.dest.root, config.src.root] : config.dest.root,
            /*directory: false,
            serveStaticOptions: {
                extensions: ['html']
            }*/
        },
        files: [
            config.dest.html + '/*.html',
            config.dest.css + '/*.css',
            config.dest.img + '/**/*'
        ],
        watch: true,
        port: util.env.port || 8080,
        
        notify: false,
        //proxy: "yourlocal.dev",
        open: true,
        //ghostMode: false,
        //online: Boolean(util.env.tunnel),
        //tunnel: util.env.tunnel || null,
        //logLevel: 'info', // 'debug', 'info', 'silent', 'warn'
        //logConnections: false,
        //logFileChanges: true,
         //Boolean(util.env.open),
    });
});


module.exports = server;