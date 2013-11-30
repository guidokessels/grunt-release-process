/*
 * grunt-release-process
 * https://github.com/guidokessels/grunt-release-process
 *
 * Copyright (c) 2013 Guido Kessels
 * Licensed under the MIT license.
 */

var semver = require('semver'),
    shell = require('shelljs');

module.exports = function (grunt) {

  'use strict';

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerTask('release', 'Let Grunt manage your whole release process', function (type) {

    var done       = this.async(),
        newVersion = false,
        // Merge task-specific and/or target-specific options with these defaults.
        options    = this.options({
          bump      : ['package.json'],
          changelog : {},
          commit    : 'Release <%= version %>',
          tag       : 'Release <%= version %>'
        }),
        // Keep track of all the files we need to commit
        filesToCommit = [];

    if (options.changelog) {
      options.changelog.file         = options.changelog.file         || 'CHANGELOG.md';
      options.changelog.title        = options.changelog.title        || '# <%= version %>';
      options.changelog.seperator    = options.changelog.seperator    || '\n';
      options.changelog.commitFormat = options.changelog.commitFormat || '- %s ([%h](%H))';
    }
    
    function fail() {
      done(false);
    }

    function processTemplate(tpl) {
      return grunt.template.process(tpl, {
        data: {
          version : newVersion,
          date    : grunt.template.today('yyyy-mm-dd')
        }
      });
    }

    function verify_release_type(type) {
      grunt.verbose.write('Verifying release type...');
      if (-1 === ['major', 'minor', 'patch'].indexOf(type)) {
        grunt.log.warn(type ? '"' + type + '" is not a valid release type!' : 'No release type specified!');
        grunt.log.warn('Please use one of: "major", "minor", "patch"');
        return fail();
      }
      grunt.verbose.ok();
    }

    function bump_version(files, type) {
      if (files && Array.isArray(files)) {
        grunt.log.subhead('Bumping version number');
        files.forEach(function(filename) {
          var contents   = grunt.file.readJSON(filename),
              oldVersion;

          if (!contents.version) {
            grunt.log.warn('Could not find a "version" property to bump in ' + filename + ' JSON.');
            return fail();
          }

          oldVersion = contents.version;
          contents.version = semver.inc(contents.version, type);

          if (!newVersion) {
            newVersion = contents.version;
          }

          grunt.file.write(filename, JSON.stringify(contents, null, '  ') + '\n');

          grunt.log.write('' + filename + ': ' + oldVersion + ' => ' + contents.version);

          filesToCommit.push(filename);
        });

        grunt.log.writeln('');
        grunt.log.ok();
      }
    }

    function generate_changelog(config) {
      var title, titleTPL, commits, filecontents;

      if (config && config.file) {
        grunt.log.subhead('Updating changelog');
        filecontents = grunt.file.read(config.file);

        // Convert to Lo-Dash template and resolve to title
        titleTPL = config.title.replace(/{{/g, '<%= ').replace(/}}/g, ' %>');
        title = processTemplate(titleTPL);
        grunt.verbose.writeln('Resolved title to: ' + title);

        grunt.verbose.writeln('Retrieving and parsing all commits since previous tag');
        commits = shell.exec('git log --pretty=format:"' + config.commitFormat + '" --date-order', {
          silent: false
        }).output + config.seperator;

        grunt.file.write(config.file, [title, commits, filecontents].join('\n'));

        filesToCommit.push(config.file);

        grunt.log.writeln('');
        grunt.log.ok();
      }

    }

    function commit(config) {
      var commitMsg;

      if (config.commit && filesToCommit.length) {
        grunt.log.subhead('Committing all release files');

        filesToCommit.forEach(function(filename) {
          grunt.verbose.writeln('\t' + filename);
          shell.exec('git add ' + filename, {
            silent: true
          });
        });

        commitMsg = processTemplate(config.commit);

        shell.exec('git commit -m "' + commitMsg + '"');

        grunt.log.ok();
      }
    }

    function tag(config) {
      var tagMsg;

      if (false !== config.tag) {
        grunt.log.subhead('Creating tag');

        tagMsg = processTemplate(config.tag);

        shell.exec('git tag -a ' + newVersion + ' -m "' + tagMsg + '"');

        grunt.log.ok();
      }
    }

    verify_release_type(type);
    bump_version(options.bump, type);
    generate_changelog(options.changelog, type);
    commit(options);
    tag(options);

    done(true);
  });

};
