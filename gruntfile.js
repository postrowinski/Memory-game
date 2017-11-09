module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'style.css': 'scss/style.scss'
            }
        }
    },

  	imagemin: {
  		dynamic: {
  			files: [{
  				expand: true,
  				cwd: 'img/',
  				src: ['img/*.{png,jpg,gif}'],
  				dest: 'img/build/'
  			}]
  		}
  	},
    
    watch: {
    	scripts: {
			files: ['scss/style.scss'],
			tasks: ['sass'],
			options: {
				spawn: false,
			},
    	} 
	},
	  
	browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        '*.css',
                        '*.html',
                        'js/*.js'
                    ]
                },
                options: {
					watchTask: true,
                    server: './'
                }
            }
        }

  });
  // Load the plugins tasks 
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');

  // Default task(s).
  
  grunt.registerTask('default', ['sass', 'browserSync', 'watch']);
};

//npm init
//npm install grunt
//npm install --save-dev grunt-sass grunt-contrib-watch grunt-browser-sync