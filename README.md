# gulp-template
-----------------

## Install

1. install node.js
2. install gulp
`npm install -g gulp `
3. install Modules & Plugins `npm install del gulp-concat gulp-connect gulp-minify-css gulp-notify gulp-rename gulp-uglify --save-dev`

## gulpfile.js

```js
// Modules & Plugins
var del = require('del');
var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var minifycss = require('gulp-minify-css');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

// Error Helper
function onError(err) {
  console.log(err);
}

// Server Task.
gulp.task('server', function() {
  connect.server({
    root: 'dist/',
    livereload: true
  });
});

gulp.task('html', function() {
  gulp.src('dist/*.html')
    .pipe(connect.reload());
});

// Scripts Task.
gulp.task('scripts', function() {
  gulp.src('src/js/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({message: 'Scripts task complete'}));
});

// Styles Task.
gulp.task('styles', function() {
  gulp.src('src/css/*.css')
    .pipe(concat('all.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Watch Task.
gulp.task('watch', function() {
  gulp.watch(['app/**.html', 'src/js/**/*.js', 'src/css/**/*.css'], ['html', 'scripts', 'styles']);
}).on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type);
});

// Clean
gulp.task('clean', function(cb) {
  del(['dist/css/**', 'dist/js/**', '!dist/css', '!dist/js'],cb)
    .then(function(paths) {
      console.log('Deleted files/folders:\n', paths.join('\n'));
    })
    .then(cb);
});

// Default Task.
gulp.task('default', ['clean'], function() {
    gulp.start('html', 'styles', 'scripts', 'server', 'watch');
});
```
