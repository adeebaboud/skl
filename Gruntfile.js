 

module.exports = function (grunt) {

  'use strict';

  grunt.initConfig({
    watch: {
      
      files: ["assets/ngapp/**/*.js"  ],
      tasks: ["concat" ,"uglify"]
    },
         
	concat:{   
		options: {
		  separator: ';',
		},
		dist: {
		  src: ["assets/ngapp/directives.js","assets/ngapp/modules-def.js","assets/ngapp/ngapp.js","assets/ngapp/entityManager.js", "assets/ngapp/controllers/*.js"  ],
		  dest: 'assets/js/ngapp.js',
		},
	},
	uglify :{
		ngapp:{
			files: {
						'assets/js/ngapp.min.js': ['assets/js/ngapp.js'],
			}
		}
	},
 	//clean: ["assets/js/ngapp.js"],
       imagemin: {
        dynamic: {
            options: {
                    optimizationLevel: 3
                },
              files: [{
                expand: true,
                cwd: 'assets/tmp-img/',
                src: ['**/*.{png,jpg,gif}'],
                dest: 'assets/images'
              }]
            },
//           static: {
//              options: {
//                optimizationLevel: 3,
//                svgoPlugins: [{ removeViewBox: false }]
//              },
//              files: {
//                'dist/img.png': 'src/img.png',
//              }
//            }
       }
  });

   
 
grunt.loadNpmTasks('grunt-contrib-concat'); 
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-clean');
//grunt.loadNpmTasks('grunt-contrib-imagemin');

   

  
  grunt.registerTask('default', ['concat','uglify:ngapp','watch']);
};
