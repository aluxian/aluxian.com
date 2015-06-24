# Ghost for OpenShift

Ghost is a free, open, simple blogging platform that is available to anyone who wants to use it. 

Visit the project's website at <http://ghost.org> &bull; docs on <http://support.ghost.org>.

## Running Ghost on OpenShift

The easiest way to deploy Ghost on OpenShift is to use the [QuickStart on the OpenShift Hub](https://hub.openshift.com/quickstarts/119-ghost-0-5-10).

Note these OpenShift specific changes:

1. The content/data and content/images directories have been removed.  They are created on the server and symlinked to your $OPENSHIFT\_DATA\_DIR so that posts and uploaded images will persist across 'git pushes'

2. Even though the Node.js cartridge itself is scalable, this application will not play nice with scaling right now because the images are stored on disk, and since OpenShift does not currently support shared physical disk storage across scaled gears, this cartridge will not scale.  We are working on a solution for this.

3. This quickstart is setup to use MySQL (5.1 or 5.5) or PostgreSQL (8.4 or 9.2).  Once you click the Deploy link on the OpenShift Hub, you can choose which database you would like to use.

4. If you use a custom domain, modify the production url field in the config.js file.

### Upgrading to The Latest Version

Upgrading from the older version of this repo `< 0.5.7` requires extra steps. You'll notice there is no longer `./core`, that is because this repo now depends on `ghost` which lives in `./node_modules/ghost`. 

 1. Delete `./core`
 2. Delete `./package.json` & `./index.js`
 3. `./Gruntfile.js` & `./bower.json` are unnecessary because they are handled by the external `ghost` dependency and can be removed.
 4. Copy the following files to the root: `./Makefile`, `./index.js`, `./package.json`
 5. Make a copy of your `./config.js` because you'll need to copy that over but you don't want to overwrite it.
 6. Copy `./config.js` to the root.
 7. Modify `./config.js` so it uses your configuration variables, I.E. `mail {...}` and `url`.
 8. Run `npm install --production`
 9. `push` your updates.

If you are upgrading from `>= 0.5.7` then in most cases all you need to do is run `npm update` in root directory. There are 2 things you should be aware of while upgrading your blog:

1. RedHat OpenShift runs on Linux x64 platform. If you are running `npm update` on any other plaform (e.g. Linux x32 or Mac) you will need to make sure you have `node_modules/ghost/node_modules/sqlite3/lib/binding/node-v11-linux-x64/node_sqlite3.node` in place.

2. If you are using default theme Casper you will need to update its code manually with following command: `cp -r node_modules/ghost/content/themes/casper/ content/themes/`. Note: this will override all custom modifications that you did in the theme.

More information can be found on the [Ghost Support Site](http://support.ghost.org/how-to-upgrade/)

### Logging in For The First Time

Once you have the Ghost server up and running, you should be able to navigate to `http://<your-website>/ghost/` from a web browser, where you will be prompted to register a new user. Once you have entered your desired credentials you will be automatically logged in to the admin area.

## Copyright & License

Copyright (c) 2013-2015 Ghost Foundation - Released under the [MIT license](LICENSE).
