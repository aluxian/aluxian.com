var app,
    changed     = require('gulp-changed'),
    del         = require('del'),
    embedlr     = require('gulp-embedlr'),
    express     = require('express'),
    gulp        = require('gulp'),
    gulpif      = require('gulp-if'),
    gulputil    = require('gulp-util'),
    ignore      = require('gulp-ignore'),
    jade        = require('gulp-jade'),
    live        = true,
    livereload  = require('gulp-livereload'),
    lr          = require('tiny-lr'),
    lrport      = 35729,
    lrserver    = lr(),
    path        = require('path'),
    sass        = require('gulp-sass'),
    staticServer,
    uglify      = require('gulp-uglify');



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
        .pipe(livereload(lrserver))
        .pipe(gulp.dest('./dist/css'));
});



// jade to html
gulp.task('jade', function () {
    return gulp.src('./src/jade/*.jade')
        .pipe(jade({'pretty': true}))
        .pipe(livereload(lrserver))
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
        .pipe(livereload(lrserver))
        .pipe(gulp.dest('./dist/js'));

});



// start static server listening on port 8888
gulp.task('static', function (next) {
    staticServer = function (port) {
        app = express();
        app.use(express.static(path.resolve('./dist')));
        app.listen(port, function () {
            gulputil.log('Static server is listening at ' + gulputil.colors.cyan('http://localhost:' + port + '/'));
        });
        return {
            app: app
        };
    };
    // init server
    staticServer(8888);
    next();
});



// start livereload server, listening on port 35729
gulp.task('reload', function () {
    lrserver.listen(lrport, function (err) {
        if (err) {
            return gulputil.log(err);
        }
        gulputil.log('Livereload server listening at ' +  gulputil.colors.cyan('http://localhost:' + lrport));
    });
});



gulp.task('watch', ['static'], function () {
    livereload.listen();
    gulp.watch('./src/scss/*.scss', ['sass']);
    gulp.watch('./src/jade/**/*.jade', ['jade']);
    gulp.watch('./src/js/*.js', ['uglify']);
});



// run the default task on first run
gulp.task('default', ['clean', 'sass', 'jade', 'assets', 'uglify', 'static', 'reload', 'watch']);

gulputil.log("Everything works. Excelsior!");