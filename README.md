#GulpJadeSass
GulpJadeSass is an automated build environment that uses gulp.js, the Jade template language and Sass CSS extension language.

##Overview
Out of the box, GulpJadeSass will build a three page front end skeleton and continue to watch for changes to the .jade, .scss and .js files. Editing and saving those files will cause Gulp to render the canged .jade files into .html, or uglify all .js files (except for vendor specific files) or compile scss into css; exporting everything to the dist directory respectively. Additionally GulpJadeSass will move any static files like images and vendor specific libraries to the dist directory untouched.

###Requires
http://nodejs.org/

**Quick Start**

To set up a development environment, simply cd into your working directory and run the `gulp` command. This will build a 3 page front end skeleton, inject the JavaScript code into the rendered html templates required to auto-refresh your browser and gulp will watch for any changes to any .jade, .js or .scss files. If any changes are made, gulp will render those files and export them to the dist directory and refresh your browser for you.

To export your project for production, simply run `gulp --out`. This will build your project, but not inject the JavaScript code necessary for auto-browser refreshing.

**Goodies**
GulpJadeSass comes with a few goodies to get you going.

1. Modernizr.js in the _html-header.jade file.
2. Linked to the jQuery CDN in the _footer.jade file.
3. Out of the box, working, three page site.

##Environment structure
**dist**            Export directory.

**node_modules**    Application modules required by NodeJadeSass.

**src**             Your work files and templates. Gulp watched this folder for changed .jade, .js and .scss files.

**gulpfile.js**     The Gulp configuration file.

##Work-flow
GulpJadeSass is somewhat opinionated in this regard, but is highly customizable if you prefer something else.

GulpJadeSass was created to give developers an automated work-flow, particularly, taking care of mundane tasks like JavaScript uglification, .jade to .html conversion, converting SCSS to CSS and compressing the CSS output and even refreshing your browser for you.


1. Start by opening a terminal and running the `gulp` command inside your project directory.
2. Open your favorite web browser and navigate to http://localhost:8888
3. Open your favorite text editor and edit files in the src directory. Clicking save on any .jade, .js or .scss file will auto compile and export to the dist directory--and--will auto refresh your browser so you can see the changes live.
4. When you are finished editing and ready to export your project for production, simply run `gulp --out` and your finished files will be exported to the dist directory.

Note - the only difference between `gulp` and `gulp --out` is that `gulp --out` will *not* inject the JavaScript snippet into your compiled .html files required by GulpJadeSass to auto refresh your browser.

##Extending##
If you like GulpJadeSass, great, if not, great too. You can simply add or remove modules from the project by installing or removing node_modules. To add a module just run the command `npm install <module>` and then edit your gulpfile.js. To remove a module run `npm remove <module` and again, edit your gulpfile.js.

##More information##
Gulp http://gulpjs.com/

SASS http://sass-lang.com/

JADE http://jade-lang.com/

Gulp Plug-ins - http://gratimax.github.io/search-gulp-plugins/
