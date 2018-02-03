var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var del = require('del');
var connect = require('gulp-connect');

var paths = {
  sass: './src/scss',
  css: './src/css'
};

gulp.task('connect', function() {
  connect.server({
    root: './',
    port: '9127',
    livereload: true
  });
});

gulp.task('clean', function(cb) {
  del([paths.css + '/main.css'], cb);
});

gulp.task('sass', function(cb) {
  gulp
    .src(paths.sass + '/main.scss')
    .pipe(sourcemaps.init())

    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.css))
    .pipe(
      minifyCss({
        keepSpecialComments: 0
      })
    )
    .pipe(rename({ extname: '.min.css' }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.css))
    .on('end', cb);
});

gulp.task('reload', function() {
  gulp.src('./*').pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(paths.sass + '/**/*.scss', ['sass', 'reload']);
  gulp.watch('./src/view/*.html', ['reload']);
  gulp.watch('./src/js/*.js', ['reload']);
});

gulp.task('default', ['clean', 'connect', 'sass', 'watch']);
