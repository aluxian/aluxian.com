var del         = require('del'),
    ecstatic    = require('ecstatic'),
    gulp        = require('gulp'),
    http        = require('http'),
    $           = require('gulp-load-plugins')(),
    port        = 8888,
    live        = false;

// Turn on live mode
gulp.task('live', function () {
  live = true;
});

// Remove the dist folder
gulp.task('purge', del.bind(null, ['./dist']));

// Remove the files inside the dist folder
gulp.task('clean', del.bind(null, ['./dist/**/*.*']));

// Compile SASS into compressed CSS
gulp.task('sass', function () {
  return gulp.src('./src/sass/*.sass')
    .pipe($.changed('./dist/css'))
    .pipe($.sass({
      outputStyle: 'compressed',
      sourceComments : 'normal',
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./dist/css'));
});

// Compile Jade to HTML
gulp.task('jade', function () {
  return gulp.src('./src/jade/*.jade')
    .pipe($.jade({
      'pretty': true,
      'locals': require('./src/db/database.json')
    }))
    .pipe($.if(!live, $.embedlr()))
    .pipe(gulp.dest('./dist'));
});

// Move static assets
gulp.task('assets', function () {
  gulp.src('./src/bower_components/**')
    .pipe(gulp.dest('./dist/bower_components'));
  gulp.src('./src/img/**')
    .pipe(gulp.dest('./dist/img'));
});

// Compress JavaScript
gulp.task('uglify', function () {
  return gulp.src('./src/js/*.js')
    .pipe($.changed('./dist/js'))
    .pipe($.uglify())
    .pipe(gulp.dest('./dist/js'));
});

// Start static server listening
gulp.task('static', ['build'], function (next) {
  http.createServer(
    ecstatic({ root: './dist', cache: 'no-cache', showDir: true })
  ).listen(port, function () {
    $.util.log('Static server is listening at ' + $.util.colors.cyan('http://localhost:' + port + '/'));
    next();
  });
});

// Start livereload server, listening on port 'lrport'
gulp.task('watch', ['static'], function () {
  gulp.watch('./src/sass/*.sass', ['sass']);
  gulp.watch('./src/jade/**/*.jade', ['jade']);
  gulp.watch('./src/js/*.js', ['uglify']);
  gulp.watch('./src/db/database.json', ['clean', 'build']);
  gulp.watch('./dist/**', function (file) {
    $.livereload.changed(file.path);
  });
});

// All build tasks
gulp.task('build', ['clean', 'sass', 'jade', 'assets', 'uglify']);

// Run the default task on first run
gulp.task('default', ['clean', 'watch']);
