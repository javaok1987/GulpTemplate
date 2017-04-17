//Modules
import del from 'del';
import fs from 'fs';

//gulp.js plugin registry.
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

const paths = {
  root: './',
  appPath: './Content/',
  scriptPath: './Scripts/',
  stylePath: './Sass/',
  imagePath: './Images/',
};

// Error Helper
function onError(err) {
  console.log(err);
}

// Server Task.
gulp.task('server', () => {
  $.connect.server({
    root: paths.root,
    livereload: true
  });
});

gulp.task('html', () => {
  gulp.src(`${paths.root}*.html`)
    .pipe($.connect.reload());
});

// Scripts Task.
gulp.task('scripts', () => {
  gulp.src(`${paths.scriptPath}*.js`)
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.concat('main.js'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(`${paths.scriptPath}dist/`))
    .pipe($.connect.reload());
});

gulp.task('scripts-prod', () => {
  gulp.src(`${paths.scriptPath}*.js`)
    .pipe($.concat('main.js'))
    .pipe($.babel())
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe($.uglify())
    .pipe(gulp.dest(`${paths.scriptPath}dist/`));
});

// Styles Task.
gulp.task('style', () => {
  gulp.src(`${paths.stylePath}*.scss`)
    .pipe($.plumber()) //例外處理，避免例外導致 gulp watch 失效中斷
    .pipe($.compass({
      css: `${paths.appPath}/css`, // compass 輸出位置
      sass: paths.stylePath, // sass 來源路徑
      image: `${paths.appPath}/img`, // 圖片來源路徑
      style: 'compressed', // CSS 處理方式，預設 nested（expanded, nested, compact, compressed）
      comments: true, // 是否要註解，預設(true)
      require: [], // 額外套件 susy
    }))
    .pipe($.connect.reload());
});


// Watch Task.
gulp.task('watch', () => {
  gulp.watch(`${paths.root}*.html`, ['html']);
  gulp.watch(`${paths.scriptPath}*.js`, ['scripts']);
  gulp.watch(`${paths.stylePath}**/*.scss`, ['style']);
}).on('change', (event) => {
  console.log(`File ${event.path} was ${event.type}`);
});

// Clean
gulp.task('clean', (cb) => {
  del([`${paths.scriptPath}/dist/*.min.js`, `${paths.appPath}/css/**`, '!../Content/css'], cb)
    .then((paths) => {
      console.log('Deleted files/folders:\n', paths.join('\n'));
    })
    .then(cb);
});

// Default Task.
gulp.task('default', ['clean'], () => {
  gulp.start('html', 'style', 'scripts', 'server', 'watch');
});

// Compile Task.
gulp.task('compile', ['clean'], () => {
  gulp.start('style', 'scripts');
});

// Image compress.
gulp.task('image', () => {
  gulp.src(paths.imagePath + '**')
    .pipe($.imagemin())
    .pipe(gulp.dest(`${paths.appPath}/img`));
});
