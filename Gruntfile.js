/* jshint strict: true */
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        jst: {
            compile: {
                files: {
                    "app/templates.js": ["templates/*.html"]
                }
            }
        },
        bower_concat: {
            all: {
                dest: 'app/dependencies.js',
                dependencies: {
                    'ratchet': 'jquery',
                    'underscore': 'jquery',
                    'backbone': 'underscore'
                },
                bowerOptions: {
                    relative: false
                }
            }
        },
        clean: [
            'www'
        ],
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    "app/css/index.css": "app/css/index.scss"
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    'app/css/style.css': [
                        'app/bower_components/ratchet/dist/css/ratchet.min.css',
                        'app/css/index.css'
                    ]
                }
            }
        },
        copy: {
            app: {
                expand: true,
                cwd: 'app/',
                src: [
                    '**',
                    '!**/css/*.scss',
                    '!**/bower_components/**/*.html',
                    '!phonegap.js',
                    '!debugdata.json',
                    '!base_config.xml'
                ],
                dest: 'www/'
            },
            config: {
                src: 'app/base_config.xml',
                dest: 'www/config.xml'
            }
        },
        jshint: {
            client: {
                src: [
                    'app/js/*.js',
                    'tests/*.js',
                    'Gruntfile.js'
                ],
                directives: {
                    browser: true,
                    nomen: true,
                    unused: false,
                    predef: [
                        'jQuery',
                        '$',
                        'Backbone',
                        'require',
                        'window',
                        'alert'
                    ]
                }
            }
        },
        uglify: {
            dist: {
                src: [
                    'app/dependencies.js'
                ],
                dest: 'app/dependencies.min.js'
            }
        },
        jasmine: {
            coverage: {
                src: [
                    'app/js/*.js'
                ],
                options: {
                    keepRunner: true,
                    vendor: [
                        'app/dependencies.js',
                        'app/bower_components/backbone-faux-server/backbone-faux-server.js',
                        'app/templates.js'
                    ],
                    specs: [
                        'tests/*.js'
                    ],
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'coverage/coverage.json',
                        report: [
                            {
                                type: 'cobertura',
                                options: {
                                    dir: 'coverage'
                                }
                            },
                            {
                                type: 'html',
                                options: {
                                    dir: 'coverage'
                                }
                            }
                        ],
                        thresholds: {
                            lines: 75,
                            statements: 75,
                            branches: 75,
                            functions: 90 
                        }
                    },
                    junit: {
                        path: 'report',
                        consolidate: true
                    }
                }
            }
        },
        watch: {
            scripts: {
                files: [
                    'app/css/index.scss',
                    'app/index.html',
                    'app/js/*.js',
                    'tests/*.js',
                    'templates/*.html'
                ],
                tasks: ['default'],
                options: {
                    spawn: false,
                    livereload: {
                        options: {
                            livereload: 35729
                        }
                    }
                }
            }
        },
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost',
                livereload: 35729,
                open: 'http://localhost:9000/app/index.html',
                debug: true
            },
            app: {
                base: 'app',
                livereload: true
            }
        },
        plato: {
            app: {
                files: {
                    'reports': [
                        'app/js/*.js'
                    ]
                }
            }
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-plato');

    // Register tasks
    grunt.registerTask('test', ['jst', 'jshint', 'jasmine', 'plato']);
    grunt.registerTask('default', ['bower_concat', 'cssmin', 'uglify', 'test', 'clean', 'sass', 'copy']);
    grunt.registerTask('server', ['default', 'connect', 'watch']);
};
