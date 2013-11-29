/*
 * grunt-release-process
 * https://github.com/guidokessels/grunt-release-process
 *
 * Copyright (c) 2013 Guido Kessels
 * Licensed under the MIT license.
 */

var semver = require('semver');

module.exports = function (grunt) {

  'use strict';

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerTask('release', 'Let Grunt manage your whole release process', function (type) {

    var done, options;

    done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    options = this.options({
      bump: ['package.json']
    });

    function fail() {
      done(false);
    }

    function verify_release_type(type) {
      if (-1 === ['major', 'minor', 'patch'].indexOf(type)) {
        grunt.log.warn(type ? '"' + type + '" is not a valid release type!' : 'No release type specified!');
        grunt.log.warn('Please use one of: "major", "minor", "patch"');
        fail();
      }
    }

    function bump_version(files, type) {
      if (files && Array.isArray(files)) {
        files.forEach(function(filename) {
          var contents = grunt.file.readJSON(filename);

          if (!contents.version) {
            grunt.log.warn('Could not find a "version" property to bump in ' + filename + ' JSON.');
            return fail();
          }

          contents.version = semver.inc(contents.version, type);
          
          grunt.file.write(filename, JSON.stringify(contents, null, '  ') + '\n');
        });
      }
    }

    verify_release_type(type);
    bump_version(options.bump, type);

    done(true);

    // Iterate over all specified file groups.
    /*this.files.forEach(function (file) {
      // Concat specified files.
      var src = file.src.filter(function (filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function (filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join(grunt.util.normalizelf(options.separator));

      // Handle options.
      src += options.punctuation;

      // Write the destination file.
      grunt.file.write(file.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + file.dest + '" created.');
    });*/
  });

};
