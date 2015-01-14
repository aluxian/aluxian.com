fs       = require 'fs'
del      = require 'del'
ecstatic = require 'ecstatic'
gulp     = require 'gulp'
http     = require 'http'
$        = require('gulp-load-plugins')()
port     = 8888
live     = false

gulp.task 'live', -> live = true

gulp.task 'purge', (cb) -> del(['./dist', './temp'], cb)
gulp.task 'clean', (cb) -> del(['./dist/**/*.*', './temp/**/*.*'], cb)

gulp.task 'jade', ->
  gulp.src './src/jade/*.jade'
    .pipe $.jade
      pretty: true
      locals: require './src/db/database.json'
    .pipe $.if !live, $.embedlr()
    .pipe $.htmlmin
      collapseWhitespace: true
      keepClosingSlash: true
    .pipe gulp.dest './dist'

gulp.task 'assets', ->
  gulp.src './src/img/**'
    .pipe gulp.dest './dist/img'
  gulp.src './src/favicons/**'
    .pipe gulp.dest './dist'

gulp.task 'fonts', ->
  gulp.src './src/sass/fonts.sass'
    .pipe $.sass
      outputStyle: 'compressed'
      sourceComments : 'normal'
      errLogToConsole: true
    .pipe $.if live, $.cssmin()
    .pipe gulp.dest './dist'

gulp.task 'sass', ['jade'], ->
  gulp.src ['./src/bower_components/normalize-css/normalize.css', './src/sass/styles.sass']
    .pipe $.if /[.]sass$/, $.sass
      outputStyle: 'compressed'
      sourceComments : 'normal'
      errLogToConsole: true
    .pipe $.concat 'styles.css'
    .pipe $.if live, $.cssmin()
    .pipe gulp.dest './temp'

gulp.task 'coffee', ->
  gulp.src ['./src/bower_components/smooth-scroll/dist/js/smooth-scroll.js', './src/coffee/*.coffee']
    .pipe $.if /[.]coffee$/, $.coffee({ bare: true }).on('error', $.util.log)
    .pipe $.concat 'main.js'
    .pipe $.if live, $.uglify()
    .pipe gulp.dest './temp'

gulp.task 'inject', ['sass', 'coffee'], ->
  gulp.src './dist/index.html'
    .pipe $.replace /<!-- inject:css-->/, '<style>' + fs.readFileSync('./temp/styles.css', 'utf8') + '</style>'
    .pipe $.replace /<!-- inject:js-->/, '<script>' + fs.readFileSync('./temp/main.js', 'utf8') + '</script>'
    .pipe gulp.dest './dist'

gulp.task 'static', ['build'], (next) ->
  http.createServer ecstatic { root: './dist', cache: 'no-cache', showDir: true }
    .listen port, ->
      $.util.log 'Static server is listening at ' + $.util.colors.cyan("http://localhost:#{port}/")
      next()

gulp.task 'watch', ['static'], ->
  gulp.watch './src/sass/*.sass', ['fonts', 'sass', 'inject']
  gulp.watch './src/jade/**/*.jade', ['jade', 'inject']
  gulp.watch './src/coffee/*.coffee', ['coffee', 'inject']
  gulp.watch './src/db/database.json', ['jade', 'inject']
  gulp.watch './src/img/**/*.*', ['assets']
  gulp.watch './src/favicons/**/*.*', ['assets']
  gulp.watch './src/svg/**/*.svg', ['jade', 'inject']
  gulp.watch './dist/**', (file) -> $.livereload.changed file.path

gulp.task 'build', ['fonts', 'sass', 'jade', 'assets', 'coffee', 'inject']
gulp.task 'default', ['watch']
