//Modules
var del = require('del');
var fs = require('fs');
var sass = require('node-sass');

//gulp.js plugin registry.
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var config = require('./config');


// Error Helper
function onError(err) {
  console.log(err);
}

// Server Task.
gulp.task('server', function() {
  plugins.connect.server({
    root: config.appPath,
    livereload: true
  });
});

gulp.task('html', function() {
  gulp.src(config.appPath + '*.html')
    .pipe(plugins.connect.reload());
});

// Scripts Task.
gulp.task('scripts', function() {
  gulp.src(config.scriptPath + '*.js')
    .pipe(plugins.concat('main.js'))
    .pipe(gulp.dest(config.appPath + 'js'))
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(config.appPath + 'js'))
    .pipe(plugins.connect.reload());
});

// Styles Task.
gulp.task('sass', function() {
  sass.render({
    file: config.stylePath + 'main.scss',
  }, function(err, result) {
    var _dir = config.appPath + 'css/';
    if (!fs.existsSync(_dir)) {
      fs.mkdirSync(_dir);
    }
    fs.writeFile(_dir + 'main.css', result.css, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
      gulp.src(_dir + 'main.css')
        .pipe(plugins.minifyCss())
        .pipe(plugins.rename({
          suffix: '.min'
        }))
        .pipe(gulp.dest(_dir))
        .pipe(plugins.connect.reload());
    });
  });
});

// Watch Task.
gulp.task('watch', function() {
  gulp.watch(config.appPath + '*.html', ['html']);
  gulp.watch(config.scriptPath + '*.js', ['scripts']);
  gulp.watch(config.stylePath + '*.scss', ['sass']);
}).on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type);
});

// Clean
gulp.task('clean', function(cb) {
  del([config.appPath + 'css/**', config.appPath + 'js/**', '!app/css', '!app/js'], cb)
    .then(function(paths) {
      console.log('Deleted files/folders:\n', paths.join('\n'));
    })
    .then(cb);
});

// Default Task.
gulp.task('default', ['clean'], function() {
  gulp.start('html', 'sass', 'scripts', 'server', 'watch');
});

// Deploy Task.
gulp.task('deploy', function() {
  return gulp.src(config.appPath + '**/*')
    .pipe(plugins.ghPages());

});
