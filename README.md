# Ghost for OpenShift

Ghost is a free, open, simple blogging platform that's available to anyone who wants to use it. Lovingly created and maintained by [John O'Nolan](http://twitter.com/JohnONolan) + [Hannah Wolfe](http://twitter.com/ErisDS) + an amazing group of [contributors](https://github.com/TryGhost/Ghost/contributors).

Visit the project's website at <http://ghost.org> &bull; docs on <http://support.ghost.org>.

## Running Ghost on OpenShift

This is a basic quickstart to get Ghost running on OpenShift.  

If you have already created an application with this, and are having issues with it not working when you do a restart, 
run this command, then issue a restart and it should be fixed.

	rhc set-env NODE_ENV=production --app $appname

Where $appname is the name of your application.  This was due to the pre_start_nodejs script not running on a restart.

The easiest way is to use the following command, make sure that you run 'gem update rhc' first so that you have the newest version:

	rhc app create ghost nodejs-0.10 --env NODE_ENV=production --from-code https://github.com/openshift-quickstart/openshift-ghost-quickstart.git

'ghost' will be the name of your application.  

Note these OpenShift specific changes:

1. The content/data and content/images directories have been removed.  They are created on the server and symlinked to your $OPENSHIFT\_DATA\_DIR so that posts and uploaded images will persist across 'git pushes'

2. Even though the Node.js cartridge itself is scalable, this application will not play nice with scaling right now because it is using **SQLite3** as the database (which is a file store), and the images are stored on disk, and since OpenShift does not currently support shared physical disk storage across scaled gears, this cartridge will not scale.  We are working on a solution for this.

3. This quickstart currently is not setup for using MySQL, use [MySQL repository](https://github.com/openshift-quickstart/openshift-ghost-mysql-quickstart) if you need it. That will eliminate one of the scaling concerns.

4. If you use a custom domain, modify the production url field in config.js file.

### Upgrading to The Latest Version

In most cases all you need to do is run `npm update` in root directory. There are 2 things you should be aware of while upgrading your blog:

1. RedHat OpenShift runs on Linux x64 platform. If you are running `npm update` on any other plaform (e.g. Linux x32 or Mac) you will need to make sure you have `node_modules/ghost/node_modules/sqlite3/lib/binding/node-v11-linux-x64/node_sqlite3.node` in place.

2. If you are using default theme Casper you will need to update its code manually with following command: `cp -r node_modules/ghost/content/themes/casper/ content/themes/`. Note: this will override all custom modifications that you did in the theme.

More information can be found on the [Ghost Support Site](http://support.ghost.org/how-to-upgrade/)

### Logging in For The First Time

Once you have the Ghost server up and running, you should be able to navigate to `http://<your-website>/ghost/` from a web browser, where you will be prompted to register a new user. Once you have entered your desired credentials you will be automatically logged in to the admin area.

## Copyright & License

Copyright (c) 2013-2015 Ghost Foundation - Released under the [MIT license](LICENSE).
