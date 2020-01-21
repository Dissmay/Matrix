let util = require('gulp-util');

let production = util.env.production || util.env.prod || false;
let destPath = 'build';


let config = {

	src: {
		root     : 'src',
		js       : 'src/js',
		precss   : 'src/precss',
		img      : 'src/img',
		icons    : 'src/img/icons',
		svg      : 'src/img/svg',
		fonts    : 'src/fonts',
		templates: 'src/templates'
	},

	dest: {
		root :   destPath,
		html :   destPath,
		js   :   destPath + '/js',
		css  :   destPath + '/css',
		img  :   destPath + '/img',
		icons:   destPath + '/img/icons',
		svg  :   destPath + '/img/svg',
		fonts:   destPath + '/fonts'
	},

	setEnv: function(env) {
        if (typeof env !== 'string') return;
        this.env = env;
        this.production = env === 'production';
        process.env.NODE_ENV = env;
    },

    logEnv: function() {
        util.log(
            'Environment:',
            util.colors.white.bgRed(' ' + process.env.NODE_ENV + ' ')
        );
    },

    errorHandler: require('./util/handle-errors')
}

config.setEnv(production ? 'production' : 'development');

module.exports = config;