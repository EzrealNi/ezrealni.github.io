var gulp = require('gulp');
var connect = require('gulp-connect');
var watch = require('gulp-watch');

var src = '.';

gulp.task('webserver', function() {
  connect.server({
    root: src,
    port: 8080,
    livereload: true
  });
});

gulp.task('livereload', function() {
  var reloadFiles = [src + '/vender/*.js', src + '/*.html'];
  watch(reloadFiles).pipe(connect.reload());
});

// run
gulp.task('default', ['webserver', 'livereload']);
