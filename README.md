#GulpJadeSass
GulpJadeSass is an automated build environment that uses the (streaming) build system gulp.js, the Jade template language and the Sass CSS extension language.

##Overview
Out of the box, GulpJadeSass will build a three page front end skeleton and continue to watch for changes to the .jade, .scss and .js files. Editing and saving those files will cause Gulp to render the canged .jade files into .html, or uglify all .js files (except for vendor specific files) or compile scss into css.

###Requires
http://nodejs.org/

http://gulpjs.com/


**Quick Start**

To set up a development environment, simply cd into your working directory and run the `gulp` command. This will build a 3 page front end skeleton, inject the JavaScript code into the rendered html templates required to auto-refresh your browser and gulp will watch for any changes to any .jade, .js or .scss files. If any changes are made, gulp will render those files and export them to the dist directory and refresh your browser for you.

To export your project for production, simply run `gulp --live`. This will build your project, but not inject the JavaScript code necessary for auto-browser refreshing.

**Goodies**
GulpJadeSass comes with a few goodies to get you going.

1. Modernizr.js in the html-head.jade file.
2. Linked to the jQuery CDN in the footer.jade file.
3. Out of the box, working, three page site. (If all you need is a working front end prototype, you can simply use the included dist directory)

##Environment structure
**dist:**            Export directory. You should not "work" in this directory. This folder represents the finished product where GJS exports your files.

**node_modules:**    This is where NPM installs modules required by GulpJadeSass. Do not manually modify anything in this directory. If you would like to customize this environment, simply use NPM to install additional--or delete--modules.

**src:**             Your work files and templates. Gulp watches this folder for changes to any .jade, .js and .scss files. This folder is where you do all your work.

**README.md**       You're looking at it!

**gulpfile.js:**     The Gulp configuration file. If you add or delete modules, be sure to update this file.

##Work-flow
GulpJadeSass is somewhat opinionated in this regard, but is highly customizable if you prefer something else.

GulpJadeSass was created to give developers an automated work-flow, particularly, taking care of mundane tasks like JavaScript uglification, .jade to .html conversion, converting SCSS to CSS and compressing the CSS outpu--and even refreshing your browser for you!


1. Start by opening a terminal and running the `gulp` command inside your project directory.
2. Open your favorite web browser and navigate to http://localhost:8888
3. Open your favorite text editor and edit files in the src directory. Saving any .jade, .js or .scss file will auto compile and export to the dist directory--and--will auto refresh your browser so you can see the changes live. Static files such as images and vendor specific scripts should be placed in the src/img and src/js/vendor directories respectively. These files will only be moved to the dist directory when GuplJadeSass first starts.
4. When you are finished editing and ready to export your project for production, simply run `gulp --live` and your finished files will be exported to the dist directory.

Note - the only difference between `gulp` and `gulp --live` is that `gulp --live` will *not* inject the JavaScript snippet into your compiled .html files required by GulpJadeSass to auto refresh your browser. Run `gulp --live` only when you are ready to export for produciton.

##Extending##
If you like GulpJadeSass, great, if not, great too. You can simply add or remove modules from the project by installing or removing node_modules. To add a module just run the command `npm install <module-name>` and then edit your gulpfile.js. To remove a module run `npm remove <module-name>` and again, edit your gulpfile.js.

##More information##
Gulp http://gulpjs.com/

SASS http://sass-lang.com/

JADE http://jade-lang.com/

Gulp Plug-ins - http://gratimax.github.io/search-gulp-plugins/

###ToDo###
Watch static directories.


###Thank You###
A huge shout out to my friend and fellow developer, Francisco Arenas! Thanks for turning me on to Jade and all your work getting the templates set up. https://github.com/dospuntocero