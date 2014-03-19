var app,
    changed     = require('gulp-changed'),
    clean       = require('gulp-clean'),
    es          = require('event-stream'),
    embedlr     = require('gulp-embedlr'),
    express     = require('express'),
    gulp        = require('gulp'),
    gulpif      = require('gulp-if'),
    gulputil    = require('gulp-util'),
    isdev       = gulputil.env.type !== 'out',
    jade        = require('gulp-jade'),
    livereload  = require('gulp-livereload'),
    lr          = require('tiny-lr'),
    lrport      = 35729,
    lrserver    = lr(),
    path        = require('path'),
    rename      = require('gulp-rename'),
    sass        = require('gulp-sass'),
    staticServer,
    uglify      = require('gulp-uglify');


// move static assets
gulp.task('assets', function() {
    return es.concat(
        gulp.src('src/js/vendor/*.js')
            .pipe(gulp.dest('dist/js/vendor')),
        gulp.src('src/img/**')
            .pipe(gulp.dest('dist/img'))
    );
});


// clear all .html, .css and .js files before build
gulp.task('clean', function() {
    return gulp.src(['dist/*.html','dist/js/*.js','dist/css/*.css'], {'read': false})
        .pipe(clean());
});


// jade to html
gulp.task('jade', function() {
    return gulp.src('src/jade/*.jade')
        .pipe(jade({'pretty':true}))
        .pipe(livereload(lrserver))
        .pipe(gulpif(isdev, embedlr()))
        .pipe(gulp.dest('dist'));
});


// compile scss as compressed css
gulp.task('sass', function() {
    return gulp.src('src/scss/*.scss')
        .pipe(changed('dist/css'))
        .pipe(sass({'outputStyle':'compressed'}))
        .pipe(livereload(lrserver))
        .pipe(gulp.dest('dist/css'));
});


// compress javascript
gulp.task('uglify', function() {
    return gulp.src('src/js/*.js')
        .pipe(changed('dist/js'))
        .pipe(uglify())
        .pipe(livereload(lrserver))
        .pipe(gulp.dest('dist/js'));
});


// static server listening on port 8888
staticServer = function(port) {
    app = express();
    app.use(express.static(path.resolve('dist')));
    app.listen(port, function() {
        gulputil.log('Static server listening at http://localhost:'+port);
    });
    return {
        app: app
    };
};
// call static server and specify port
staticServer(8888);


// run the default task
gulp.task('default', function() {
    // run all tasks on first run
    gulp.start('clean', 'sass', 'jade', 'assets', 'uglify');

    // start livereload server, listening on port 35729
    lrserver.listen(lrport, function (err) {

        if (err) {
            return console.log(err)
        };
        gulputil.log('Livereload server listening at http://localhost:'+lrport);
        // then start watching src files
        gulp.watch('src/scss/*.scss', function(event){
            gulp.start('sass');
        });
        gulp.watch('src/js/*.js', function(event){
            gulp.start('uglify');
        });
        gulp.watch('src/jade/**/*.jade', function(event){
            gulp.start('jade');
        });
    });
});
