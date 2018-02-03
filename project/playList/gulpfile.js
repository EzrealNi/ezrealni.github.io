var gulp = require('gulp');
var connect = require('gulp-connect');
// var proxy = require('http-proxy-middleware');

gulp.task('connect', function() {
  connect.server({
    root: '',
    port: '8888',
    livereload: true
    // middleware: function(connect, opt) {
    //   return [
    //     proxy('/fs', {
    //       target: 'http://172.16.2.52:8080',
    //       changeOrigin: true
    //     })
    //   ];
    // }
  });
});

gulp.task('reload', function() {
  gulp.src('./*').pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch('./source/*.css', ['reload']);
  gulp.watch('./*.html', ['reload']);
  gulp.watch('./source/*.js', ['reload']);
});

gulp.task('default', ['connect', 'watch']);
