'use strict';

var gulp = require('gulp');
var startGulp = require('@ducatus/ducatuscore-build');
module.exports = startGulp('p2p', {skipBrowser: true})

gulp.task('default', ['lint', 'coverage']);
