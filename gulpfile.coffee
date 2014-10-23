del      = require 'del'
ecstatic = require 'ecstatic'
gulp     = require 'gulp'
http     = require 'http'
$        = require('gulp-load-plugins')()
port     = 8888
live     = false

gulp.task 'live', -> live = true

gulp.task 'purge', (cb) -> del(['./dist'], cb)
gulp.task 'clean', (cb) -> del(['./dist/**/*.*'], cb)

gulp.task 'sass', ->
  gulp.src './src/sass/*.sass'
    .pipe $.changed './dist/css'
    .pipe $.sass
      outputStyle: 'compressed'
      sourceComments : 'normal'
      errLogToConsole: true
    .pipe gulp.dest './dist/css'

gulp.task 'jade', ->
  gulp.src './src/jade/*.jade'
    .pipe $.jade
      pretty: true
      locals: require './src/db/database.json'
    .pipe $.if !live, $.embedlr()
    .pipe gulp.dest './dist'

gulp.task 'assets', ->
  gulp.src './src/bower_components/**'
    .pipe gulp.dest './dist/bower_components'
  gulp.src './src/img/**'
    .pipe gulp.dest './dist/img'

gulp.task 'coffee', ->
  gulp.src './src/coffee/*.coffee'
    .pipe $.changed './dist/js'
    .pipe $.coffee({ bare: true }).on 'error', $.util.log
    .pipe $.if live, $.uglify()
    .pipe gulp.dest './dist/js'

gulp.task 'static', ['build'], (next) ->
  http.createServer ecstatic { root: './dist', cache: 'no-cache', showDir: true }
    .listen port, ->
      $.util.log 'Static server is listening at ' + $.util.colors.cyan("http://localhost:#{port}/")
      next()

gulp.task 'watch', ['static'], ->
  gulp.watch './src/sass/*.sass', ['sass']
  gulp.watch './src/jade/**/*.jade', ['jade']
  gulp.watch './src/coffee/*.coffee', ['coffee']
  gulp.watch './src/db/database.json', ['jade']
  gulp.watch './src/img/**/*.*', ['assets']
  gulp.watch './src/svg/**/*.svg', ['jade']
  gulp.watch './dist/**', (file) -> $.livereload.changed file.path

gulp.task 'build', ['sass', 'jade', 'assets', 'coffee']
gulp.task 'default', ['watch']
