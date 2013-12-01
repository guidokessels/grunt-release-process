# grunt-release-process

> Let Grunt manage your whole release process

This Grunt plugin can automate a lot of steps in your release process, including:
- Bumping the version number in your `package.json`, `bower.json`, etc.
- Generating a changelog of all changes since your previous tag ([see example](CHANGELOG.md))
- Committing the bumped files & changelog as a 'release' commit
- Creating a tag for your release
- Pushing the tag to GitHub (or any other Git remote)

The only requirement is that your version numbers adhere to the [Semantic Versioning](http://semver.org) format: `major.minor.patch` e.g. `1.14.2`

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-release-process --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-release-process');
```

### Usage

Run `grunt release:TARGET:TYPE` where `TARGET` is the options target in your `Gruntfile.js` and `TYPE` is one of `major`, `minor` or patch`

## The "release" task

### Overview
In your project's Gruntfile, add a section named `release` to the data object passed into `grunt.initConfig()`.

The following config lists all available options and their defaults:
```js
grunt.initConfig({
  release: {
    dist: {
      options: {
        bump      : ['package.json'],
        changelog : {
          file         : 'CHANGELOG.md',
          title        : '# {{version}}',
          commitFormat : '- %s (%h)',
          seperator    : '\n'
        },
        commit    : 'Release {{version}}',    // use boolean `false` to disable
        tag       : 'Release {{version}}',    // use boolean `false` to disable
        push      : true,                     // use boolean `false` to disable
        remote    : 'origin'
      }
    }
  },
})
```

### Options

#### options.bump
Type: `Array` or `false`
Default value: `['package.json']`

An array of files which versions need to be bumped. Each file needs to contain a valid JSON object with a `version` property.
Use `false` or omit this property if you do not want to use it.

#### options.changelog
Type: `Object` or `false`
Default value: `{}` (see below for property defaults)

Use this config object to automatically generate a changelog for your release. 
This changelog will contain all commits since the previous tag.
Use `false` or omit this property if you do not want to generate a changelog.

The default values are set up to work with a Markdown file, but you can tweak them to any format you want.

#### options.changelog.file
Type: `String`
Default value: `'CHANGELOG.md'`

Name of the file to write changes to. All changes will be prepended to any existing content.
If the file does not exist, the script will trigger an error.

#### options.changelog.title
Type: `String`
Default value: `'# {{version}}`

The title of your release, which will be placed right above this release's changes.

#### options.changelog.commitFormat
Type: `String`
Default value: `'- %s (%h)'`

Used to format each commit message before it's put in your changelog file.
The commits are parsed via `git log --pretty:format:"YOUR FORMAT"`. Check Table 2-1 on the following page for all valid options format takes: http://git-scm.com/book/en/Git-Basics-Viewing-the-Commit-History

#### options.changelog.seperator
Type: `String`
Default value: `'\n'`

The string to place after each release's commits, and can be used to seperate release by newlines, etc.

#### options.commit
Type: `String` or `false`
Default value: `'Release {{version}}'`

A string that will be used as commit message when committing all changed files.
Use `false` if you do not want to commit any files automatically.

#### options.tag
Type: `String` or `false`
Default value: `'Release {{version}}'`

A string that will be used as the tag message when creating the tag.
Use `false` if you do not want to tag your release automatically.

#### options.push
Type: `Boolean`
Default value: `true`

Whether you want to push the created tag or not.
Requires `options.remote` to contain a valid remote name.

#### options.remote
Type: `String`
Default value: `'origin'`

The name of the remote you want to push the tag to.
Requires `options.push` to be set to `true`.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
See [CHANGELOG](CHANGELOG.md)

## License
Copyright (c) 2013 Guido Kessels. Licensed under the MIT license.
