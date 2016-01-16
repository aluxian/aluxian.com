module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeOptionalTags: true,
                    removeComments: true
                },
                files: {
                    'dist/index.html': 'src/index.html'
                }
            }
        },

        sass: {
            options: {
                includePaths: ['vendor/foundation/scss']
            },
            dist: {
                files: {
                    'dist/css/app.css': 'src/scss/main.scss'
                }
            }
        },

        autoprefixer: {
            dist: {
                src: 'dist/css/app.css'
            }
        },

        uncss: {
            dist: {
                options: {
                    ignore: [
                        /.*\.smaller.*/,
                        /.*\.email.*/,
                        /.*joyride.*/,
                        /.*magellan.*/,
                        '::-webkit-input-placeholder',
                        ':-moz-placeholder',
                        '::-moz-placeholder',
                        ':-ms-input-placeholder'
                    ],
                    stylesheets: [
                        'css/app.css',
                        '//fonts.googleapis.com/css?family=Montserrat|Open+Sans:400italic,400,300,600'
                    ]
                },
                files: {
                    'dist/css/app.css': 'dist/index.html'
                }
            }
        },

        cssmin: {
            dist: {
                files: {
                    'dist/css/app.css': 'dist/css/app.css'
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    'dist/js/app.js': [
                        'vendor/fastclick/lib/fastclick.js',
                        'vendor/foundation/js/foundation/foundation.js',
                        'vendor/foundation/js/foundation/foundation.topbar.js',
                        'vendor/foundation/js/foundation/foundation.magellan.js',
                        //'vendor/Parallax-ImageScroll/jquery.imageScroll.min.js',
                        'vendor/jquery.scrollTo/jquery.scrollTo.min.js',
                        'vendor/jquery.localScroll/jquery.localScroll.min.js',
                        'src/js/*.js'
                    ]
                }
            }
        },

        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: 'src/img/*.jpg',
                        dest: 'dist/img/'
                    }
                ]
            }
        },

        watch: {
            grunt: {
                files: 'Gruntfile.js',
                tasks: 'build'
            },

            html: {
                files: 'src/index.html',
                tasks: 'html'
            },

            css: {
                files: 'src/scss/**/*.scss',
                tasks: 'css'
            },

            js: {
                files: 'src/js/**/*.js',
                tasks: 'js'
            },

            img: {
                files: 'src/img/**/*.jpg',
                tasks: 'img'
            }
        }
    });

    grunt.registerTask('html', [
        'htmlmin'
    ]);

    grunt.registerTask('css', [
        'sass',
        'autoprefixer',
        'uncss',
        'cssmin'
    ]);

    grunt.registerTask('js', [
        'uglify'
    ]);

    grunt.registerTask('img', [
        'imagemin'
    ]);

    grunt.registerTask('build', [
        'html',
        'css',
        'js',
        'img'
    ]);

    grunt.registerTask('default', [
        'build',
        'watch'
    ]);
};
