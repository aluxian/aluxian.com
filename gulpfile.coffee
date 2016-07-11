fs = require 'fs'
del = require 'del'
ecstatic = require 'ecstatic'
mergeStream = require 'merge-stream'
gulp = require 'gulp'
http = require 'http'
async = require 'async'
needle = require 'needle'
$ = require('gulp-load-plugins')()
port = 8888
live = false

DIST = '../gh-pages'

gulp.task 'live', -> live = true

gulp.task 'purge', (cb) -> del([DIST], cb)
gulp.task 'clean', (cb) -> del([DIST + '/**'], cb)

gulp.task 'update:blogposts', (done) ->
  async.waterfall [
    async.apply async.parallel,
      locals: async.apply fs.readFile, './src/locals.json'
      xml: (cb) -> needle.get 'https://blog.aluxian.com/rss/', (err, body, xml) -> cb err, xml
    (data, cb) ->
      locals = JSON.parse data.locals
      locals.posts = data.xml.rss.channel.item.slice(0, 3).map (post) ->
        month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        dt = new Date(post.pubDate)

        {
          title: post.title
          url: post.link
          tags: if Array.isArray(post.category) then post.category else [post.category]
          meta: dt.getDate() + ' ' + month_names_short[dt.getMonth()] + ' ' + dt.getFullYear()
        }
      cb null, JSON.stringify(locals, null, 2)
    (txt, cb) -> fs.writeFile './src/locals.json', txt, cb
  ], done

gulp.task 'jade', ->
  gulp.src 'src/index.jade'
    .pipe $.jade
      pretty: !live
      locals: JSON.parse(fs.readFileSync('./src/locals.json'))
    .pipe $.if live, $.htmlmin
      collapseWhitespace: true
      keepClosingSlash: true
    .pipe gulp.dest DIST

gulp.task 'assets', ->
  img = gulp.src 'src/img/**'
    .pipe gulp.dest DIST + '/img'

  assets = gulp.src [
    'src/favicons/**'
    'src/assets/**'
  ]
    .pipe gulp.dest DIST

  mergeStream img, assets

gulp.task 'fonts', ->
  gulp.src 'src/sass/fonts.sass'
    .pipe $.sass
      outputStyle: if live then 'compressed' else 'nested'
      errLogToConsole: true
      indentedSyntax: true
    .pipe $.if live, $.cssmin()
    .pipe gulp.dest DIST

gulp.task 'sass', ->
  gulp.src ['bower_components/normalize-css/normalize.css', 'src/sass/styles.sass']
    .pipe $.if '.sass', $.sass({
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
    .pipe $.if live, $.combineMediaQueries() # crashes build
    .pipe $.if live, $.cssmin()
    .pipe gulp.dest DIST

gulp.task 'coffee', ->
  gulp.src ['bower_components/smooth-scroll/dist/js/smooth-scroll.js', 'src/scripts.coffee']
    .pipe $.if '.coffee', $.coffee({ bare: true }).on('error', $.util.log)
    .pipe $.concat 'scripts.js'
    .pipe $.if live, $.uglify()
    .pipe gulp.dest DIST

gulp.task 'static', ['build'], (next) ->
  http.createServer ecstatic { root: DIST, cache: 'no-cache', showDir: true }
    .listen port, ->
      $.util.log 'Static server listening at ' + $.util.colors.cyan("http://localhost:#{port}/")
      next()

gulp.task 'watch', ['static'], ->
  gulp.watch './src/sass/*.sass', ['fonts', 'sass']
  gulp.watch './src/index.jade', ['jade']
  gulp.watch './src/scripts.coffee', ['coffee']
  gulp.watch './src/locals.json', ['jade']
  gulp.watch './src/img/**', ['assets']
  gulp.watch './src/favicons/**', ['assets']
  gulp.watch './src/svg/**', ['jade']

gulp.task 'build', ['jade', 'assets', 'fonts', 'sass', 'coffee']
gulp.task 'default', ['watch']
