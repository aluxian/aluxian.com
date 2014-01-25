var app,
    changed     = require('gulp-changed'),
    clean       = require('gulp-clean'),
    es          = require('event-stream'),
    embedlr     = require('gulp-embedlr'),
    express     = require('express'),
    gulp        = require('gulp'),
    gulpif      = require('gulp-if'),
    gulputil    = require('gulp-util'),
    isdev       = gulp.env.out !== true,
    jade        = require('gulp-jade'),
    livereload  = require('gulp-livereload'),
    lr          = require('tiny-lr'),
    path        = require('path'),
    rename      = require('gulp-rename'),
    sass        = require('gulp-sass'),
    server      = lr(),
    staticServer,
    uglify      = require('gulp-uglify');


// move static assets
gulp.task('assets', function() {
    return es.concat(
        gulp.src('src/js/vendor/*.js')
            .pipe(gulp.dest('dist/js/vendor')),
        gulp.src('src/img/*')
            .pipe(gulp.dest('dist/img'))
    );
});


// clear all .html, .css and .js files before build
gulp.task('clean', function() {
    gulp.src(['dist/*.html','dist/js/*.js','dist/css/*.css'], {'read': false})
        .pipe(clean());
});


// jade to html
gulp.task('jade', function() {
    gulp.src('src/jade/*.jade')
        .pipe(jade({'pretty':true}))
        .pipe(livereload(server))
        .pipe(gulpif(isdev, embedlr()))
        .pipe(gulp.dest('dist'));
});


// compile scss as compressed css
gulp.task('sass', function() {
    gulp.src('src/scss/*.scss')
        .pipe(changed('dist/css'))
        .pipe(rename('style.css'))
        .pipe(sass({'outputStyle':'compressed'}))
        .pipe(livereload(server))
        .pipe(gulp.dest('dist/css'));
});


// compress javascript
gulp.task('uglify', function() {
    gulp.src('src/js/*.js')
        .pipe(changed('dist/js'))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest('dist/js'));
});


// static server listening on port 8888
staticServer = function(port) {
    app = express();
    app.use(express.static(path.resolve('dist')));
    app.listen(port, function() {
        gulputil.log('Listening on', port);
    });
    return {
        app: app
    };
};
staticServer(8888);


// run the default task
gulp.task('default', function() {
    // livereload server, listening on port 35729
    server.listen(35729, function (err) {
        if (err) {
            return console.log(err)
        };
        // run all tasks on first run
        gulp.run('clean', 'sass', 'jade', 'assets', 'uglify');
        // start watching src files
        gulp.watch('src/scss/*.scss', function(event){
            gulp.run('sass');
        });
        gulp.watch('src/js/*.js', function(event){
            gulp.run('uglify');
        });
        gulp.watch('src/jade/**/*.jade', function(event){
            gulp.run('jade');
        });

    });
});