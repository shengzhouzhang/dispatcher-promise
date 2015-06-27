
var path        = require('path');
var gulp        = require('gulp');
var watch       = require('gulp-watch');
var plumber     = require('gulp-plumber');
var runSequence = require('run-sequence');
var clean       = require('gulp-clean');
var babel       = require('gulp-babel');

gulp.task('clean', function (cb){
  return gulp.src('build', { read: false })
    .pipe(clean({ force: true }));
});

gulp.task('babelify', function (options, a, b) {
  return gulp.src(['src/**/*.js'])
    .pipe(plumber())
    .pipe(babel({ stage: 1 }))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(['src/**/*.js'])
  .on('change', function (event) {
    console.log('babelify:', event.path);
   return gulp.src(event.path)
     .pipe(plumber())
     .pipe(babel({ stage: 1 }))
     .pipe(gulp.dest(path.dirname(event.path).replace('/src', '/build')));
  });
});

gulp.task('build', function() {
  runSequence('clean', 'babelify');
});
