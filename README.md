#GulpJadeSass
GulpJadeSass is an automated build environment well suited for HTML, CSS and JavaScript prototyping. It runs on the (streaming) build system gulp.js. GJS uses the Jade template language to modularize html into templates, allowing developers to take a DRY approach to front-end development. Also included is the Sass CSS extension language.

##Overview
GJS watches for changes to .jade, .scss and .js files. Editing and saving those files will cause GJS to render the canged .jade files into .html, or uglify all .js files (except for vendor specific files) or compile scss into css.

**Requires**

gulp http://gulpjs.com/

node/mpm http://nodejs.org/

##Getting Started
Either:

Download https://github.com/prawnstar/gulp-jade-sass/archive/master.zip
and unzip the archive.
--or--
`git clone https://github.com/prawnstar/gulp-jade-sass.git`

Once downloaded, `cd` into gulp-jade-sass directory (you can rename this directory anything you like) and run `npm update` to install the necessary node modules.

Once everything is installed run the `gulp` command. This will start GJS. GJS will start a node web server listening on local port 8888 and a Livereload server listening on local port 35729. If you visit http://localhost:8888 with your web browser you will see a single-page scroller front end skeleton. GJS injects the JavaScript code into the rendered html templates required to auto-refresh your browser then watches for changes to any .jade, .js or .scss files. If any changes are made, GJS will re-render those files and export them to the dist directory and refresh your browser for you.

**Arguments**

__--live__ Will *not* inject the JavaScript snippet into your compiled .html files required by GJS to auto refresh your browser. Run `gulp --live` only when you are ready to export for produciton.

__--purge__ Under certain circumstances you might want to purge the entire dist directory. Like when you change directory structure and want to delete the old folders from dist. You can start GJS with the `gulp --purge` flag to delete the dist folder entirely. Once you restart GJS, GJS will rebuild the dist directory. 

**Goodies**
GJS comes with a few goodies to get you going.

1. Out of the box GJS will build a single-page scroller front-end skeleton.
2. Bower package manager to manage all your shiney things.
3. Content separated into an external json file.

##Environment structure
**dist:**            Export directory. You should not "work" in this directory. This folder represents the finished product where GJS exports your files.

**node_modules:**    This is where NPM installs modules required by GJS. Do not manually modify anything in this directory. If you would like to customize this environment, simply use `nmp install --save-dev` or `npm delete --save-dev` in the project root directory to install or delete modules. Then manually update the [gulpfile.js](https://github.com/gulpjs/gulp/blob/master/README.md#sample-gulpfilejs).

**src:**             Your work files and templates. Gulp watches this folder for changes to any .jade, .js and .scss files. This folder is where you do all your work.

**README.md**       You're looking at it!

**gulpfile.js:**     The Gulp configuration file. If you add or delete modules, be sure to update this file.

**package.json:**     NPM reads this file to install node modules.

##Work-flow
GJS is somewhat opinionated in this regard, but is highly customizable if you prefer something else.

GJS was created to give developers an automated work-flow, particularly, taking care of mundane tasks like JavaScript uglification, .jade to .html conversion, converting SCSS to CSS and compressing the CSS output--and even refreshing your browser for you!

1. Start by opening a terminal and running the `gulp` command inside your project directory.
2. Open your favorite web browser and navigate to http://localhost:8888
3. Open your favorite text editor and edit files in the src directory. Saving any .jade, .js or .scss file will auto compile and export to the dist directory--and--will auto refresh your browser so you can see the changes live. Static files such as images and vendor specific scripts should be placed in the src/img and src/bower_components directories respectively. These files will only be moved to the dist directory when GuplJadeSass first starts.
4. When you are finished editing and ready to export your project for production, simply exit GJS by pressing `Ctrl-c` to stop GJS (if it's already running), then run `gulp --live` and your finished files will be exported to the dist directory.


##Extending
If you like GJS, great, if not, great too. You can simply add or remove modules from the project by installing or removing node_modules. To add a module just run the command `npm install <module-name> --save-dev` and then edit your gulpfile.js. To remove a module run `npm remove <module-name> --save-dev` and again, edit your gulpfile.js.

##More information
Gulp http://gulpjs.com/

JADE http://jade-lang.com/

SASS http://sass-lang.com/

Gulp Plug-ins - http://gratimax.github.io/search-gulp-plugins/


##Troubleshooting
1. *I added an image to src/img... __or__ ...I added a JavaScript library to src/bower_components and I don't see my changes.*

__Stop GJS by pressing `Ctrl-c` and restart GJS by running `gulp`. By default, GJS only exports assets in src/img and src/bower_components when GJS first runs.__


###Thank You
A huge shout out to my friend, collaborator and fellow developer, Francisco Arenas! https://github.com/dospuntocero
