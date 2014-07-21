var app,
    changed     = require('gulp-changed'),
    del         = require('del'),
    embedlr     = require('gulp-embedlr'),
    ecsport     = 8888,
    ecstatic    = require('ecstatic')({root: './dist', cache: 'no-cache', showDir: true}), port = ecsport,
    gulp        = require('gulp'),
    gulpif      = require('gulp-if'),
    gulputil    = require('gulp-util'),
    http        = require('http'),
    ignore      = require('gulp-ignore'),
    jade        = require('gulp-jade'),
    live        = true,
    livereload  = require('gulp-livereload'),
    path        = require('path'),
    sass        = require('gulp-sass'),
    uglify      = require('gulp-uglify'),
    url         = require('url');



// check to see if --live was set
process.argv.forEach(function (val) {
    if (val === '--live') {
        live = false;
    }
});



// clear dist
gulp.task('clean', function (cb) {
    del(['./dist/**/*.*'], cb);
});



// compile scss as compressed css
gulp.task('sass', function () {
    return gulp.src('./src/scss/*.scss')
        .pipe(changed('./dist/css'))
        .pipe(sass({'outputStyle': 'compressed'}))
        .pipe(gulp.dest('./dist/css'));
});



// jade to html
gulp.task('jade', function () {
    return gulp.src('./src/jade/*.jade')
        .pipe(jade({'pretty': true}))
        .pipe(gulpif(live, embedlr()))
        .pipe(gulp.dest('./dist'));
});



// move static assets
gulp.task('assets', function () {
    gulp.src('./src/js/vendor/*.js')
        .pipe(gulp.dest('./dist/js/vendor'));
    gulp.src('./src/img/**')
        .pipe(gulp.dest('./dist/img'));
});



// compress javascript
gulp.task('uglify', function () {
    return gulp.src('./src/js/*.js')
        .pipe(changed('./dist/js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));

});



// all build tasks
gulp.task('build', ['clean', 'sass', 'jade', 'assets', 'uglify']);



// start static server listening on port 'ecsport'
gulp.task('static', ['build'], function (next) {
    http.createServer()
        .on('request', function (req, res) {
            ecstatic(req, res);
        })
        .listen(port, function () {
            gulputil.log('Static server is listening at ' + gulputil.colors.cyan('http://localhost:' + ecsport + '/') + ' Excelsior! :)');
            next();
        }); 
});



// start livereload server, listening on port 'lrport'
gulp.task('watch', ['static'], function () {
    gulp.watch('./src/scss/*.scss', ['sass']);
    gulp.watch('./src/jade/**/*.jade', ['jade']);
    gulp.watch('./src/js/*.js', ['uglify']);

    gulp.watch(['./dist/**'], function (file) {
        livereload.changed(file.path);
    })
});



// run the default task on first run
gulp.task('default', ['clean', 'watch']);