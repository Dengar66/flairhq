/**
 * Clean files and folders.
 *
 * ---------------------------------------------------------------
 *
 * This grunt task is configured to clean out the contents in the .tmp/public of your
 * sails project.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-clean
 */
module.exports = function(grunt) {

	grunt.config.set('jshint', {
		all: ['Gruntfile.js', 'app.js', 'api/**/*.js', 'tasks/**/*.js', 'assets/js/*.js', 'assets/common/*.js']
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');

};
