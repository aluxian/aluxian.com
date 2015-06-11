fs       = require 'fs'
del      = require 'del'
ecstatic = require 'ecstatic'
mergeStream = require 'merge-stream'
gulp     = require 'gulp'
http     = require 'http'
$        = require('gulp-load-plugins')()
port     = 8888
live     = false

DIST = '../gh-pages.aluxian.com'

gulp.task 'live', -> live = true

gulp.task 'purge', (cb) -> del([DIST, 'temp/'], cb)
gulp.task 'clean', (cb) -> del([DIST + '/**/*.*', 'temp/**/*.*'], cb)

gulp.task 'jade', ->
  gulp.src 'src/index.jade'
    .pipe $.jade
      pretty: !live
      locals: require './src/locals.json'
    .pipe $.if live, $.htmlmin
      collapseWhitespace: true
      keepClosingSlash: true
    .pipe gulp.dest DIST

gulp.task 'assets', ->
  img = gulp.src 'src/img/**'
    .pipe gulp.dest DIST + '/img'

  fav = gulp.src 'src/favicons/**'
    .pipe gulp.dest DIST

  mergeStream img, fav

gulp.task 'fonts', ->
  gulp.src 'src/sass/fonts.sass'
    .pipe $.sass
      outputStyle: if live then 'compressed' else 'nested'
      errLogToConsole: true
      indentedSyntax: true
    .pipe $.if live, $.cssmin()
    .pipe gulp.dest DIST

gulp.task 'sass', ['jade'], ->
  gulp.src ['bower_components/normalize-css/normalize.css', 'src/sass/styles.sass']
    .pipe $.if /[.]sass$/, $.sass({
      outputStyle: if live then 'compressed' else 'nested'
      indentedSyntax: true
      includePaths: [
        'bower_components/bourbon/app/assets/stylesheets/'
        'bower_components/neat/app/assets/stylesheets/'
      ]
    }).on 'error', (err) ->
      $.sass.logError err
      this.emit 'end'
    .pipe $.concat 'styles.css'
    .pipe $.if live, $.combineMediaQueries()
    .pipe $.if live, $.cssmin()
    .pipe gulp.dest DIST

gulp.task 'coffee', ->
  gulp.src ['bower_components/smooth-scroll/dist/js/smooth-scroll.js', 'src/scripts.coffee']
    .pipe $.if /[.]coffee$/, $.coffee({ bare: true }).on('error', $.util.log)
    .pipe $.concat 'scripts.js'
    .pipe $.if live, $.uglify()
    .pipe gulp.dest DIST

gulp.task 'inject', ['sass', 'coffee'], ->
  gulp.src DIST + '/index.html'
    .pipe $.replace /<!-- inject:css-->/, '<style>' + fs.readFileSync('temp/styles.css', 'utf8') + '</style>'
    .pipe $.replace /<!-- inject:js-->/, '<script>' + fs.readFileSync('temp/scripts.js', 'utf8') + '</script>'
    .pipe gulp.dest DIST

gulp.task 'static', ['build'], (next) ->
  http.createServer ecstatic { root: DIST, cache: 'no-cache', showDir: true }
    .listen port, ->
      $.util.log 'Static server listening at ' + $.util.colors.cyan("http://localhost:#{port}/")
      next()

gulp.task 'watch', ['static'], ->
  gulp.watch './src/sass/*.sass', ['fonts', 'sass', 'inject']
  gulp.watch './src/index.jade', ['jade', 'inject']
  gulp.watch './src/scripts.coffee', ['coffee', 'inject']
  gulp.watch './src/locals.json', ['jade', 'inject']
  gulp.watch './src/img/**', ['assets']
  gulp.watch './src/favicons/**', ['assets']
  gulp.watch './src/svg/**', ['jade', 'inject']

gulp.task 'build', ['fonts', 'assets', 'inject']
gulp.task 'default', ['watch']
