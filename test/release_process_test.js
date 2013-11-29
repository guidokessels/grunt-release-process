'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.release_process = {
  setUp: function (done) {
    // setup here if necessary
    done();
  },
  bump_version_number: function (test) {
    var actual = grunt.file.readJSON('tmp/fixtures/package.json'),
        expected = grunt.file.readJSON('test/expected/package.json');

    test.expect(1);
    test.equal(actual.version, expected.version, 'should bump version number.');
    test.done();
  }
};
