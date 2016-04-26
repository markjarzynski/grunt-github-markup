/*
 * grunt-github-markup
 * https://github.com/markjarzynski/grunt-github-markup
 *
 * Copyright (c) 2016 Mark Jarzynski
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var path = require('path');
  var whichSync = require('which').sync;

  function markup(args, dest, cb) {
    grunt.log.verbose.writeln('Running command: ' + args.join(' '));
    var child = grunt.util.spawn({
      cmd: args.shift(),
      args: args
    }, function (err, result, code) {
      grunt.file.write(dest,result + '\n');
      cb();
    });
    if (child) {
      //child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
    }

  }

  grunt.registerMultiTask('github_markup', 'Run github-markup', function() {
    var options = this.options();
    var cb = this.async();

    this.files.forEach(function(file){
      file.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        var args = [filepath];
        args.unshift(path.basename(whichSync('github-markup')));
        return markup(args, file.dest, cb);
      });

    });

  });

};
