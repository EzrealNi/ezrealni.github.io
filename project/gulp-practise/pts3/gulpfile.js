// 我们要压缩css js html 依赖三个插件
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var smushit = require('gulp-smushit');
var del = require('del');
var babel = require('gulp-babel');

var src = './src';
var dist = './dist';

gulp.task('jsUglify', function() {
  return gulp
    .src(src + '/js/*.js')
    .pipe(
      babel({
        presets: ['env']
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest(dist + '/js'));
});

gulp.task('cssMinify', function() {
  return gulp
    .src(src + '/css/*css')
    .pipe(minifyCss())
    .pipe(gulp.dest(dist + '/css'));
});

gulp.task('htmlMinify', function() {
  return gulp
    .src(src + '/*.html')
    .pipe(minifyHtml())
    .pipe(gulp.dest(dist));
});

gulp.task('dealImage', function() {
  return (gulp
      .src(src + '/img/**/*.{jpg,png}')
      // .pipe(
      //   smushit({
      //     verbose: true
      //   })
      // )
      .pipe(gulp.dest(dist + '/img')) );
});

gulp.task('dealData', function() {
  return gulp.src(src + '/data/*.json').pipe(gulp.dest(dist + '/data'));
});

gulp.task('clean', function(cb) {
  return del([dist], cb);
});

gulp.task('build', ['clean'], function() {
  gulp.start('jsUglify', 'cssMinify', 'htmlMinify', 'dealImage', 'dealData');
});
