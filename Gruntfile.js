
module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        myApp:{
            web: 'public',
            scripts: 'public/scripts',
            styles: 'public/styles',
            dist: 'dist'
        },
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost',
                base: ['public'],
                livereload: true
            },
            livereload: {
                options: {
                    middleware: function (connect, options) {
                        var middlewares = [];
                        var directory = options.directory || options.base[options.base.length - 1];
                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }
                        options.base.forEach(function(base) {
                            // Serve static files.
                            middlewares.push(connect.static(base));
                        });
                        // Make directory browse-able.
                        middlewares.push(connect.directory(directory));

                        return middlewares;
                    }
                }
            }
        },
        watch: {
            all: {
                // Replace with whatever file you want to trigger the update from
                // Either as a String for a single entry
                // or an Array of String for multiple entries
                // You can use globing patterns like `css/**/*.css`
                // See https://github.com/gruntjs/grunt-contrib-watch#files
                files: 'public/**',
                options: {
                    livereload: true
                }
            }
        },

        // grunt-open will open your browser at the project's URL
        open: {
            all: {
                path: 'http://localhost:9000'
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= myApp.dist %>/*',
                        '!<%= myApp.dist %>/.git*'
                    ]
                }]
            }
        },
        copy: {
            dist: {
                files:[{
                    expand: true,
                    dot: true,
                    cwd: '<%= myApp.scripts %>',
                    dest: '<%= myApp.dist %>',
                    src:[
                        'angular-click2edit.js'
                    ]
                },
                {
                    expand: true,
                    dot: true,
                    cwd: '<%= myApp.styles %>',
                    dest: '<%= myApp.dist %>',
                    src:[
                        'angular-click2edit.css'
                    ]
                }                ]
            }
        },
        uglify:
        {
            '<%= myApp.dist %>/angular-click2edit.min.js': ['<%= myApp.scripts %>/angular-click2edit.js'],
            options:{
                mangle: false // without this, angular will puke on the minified js
            }
        },
        cssmin: {
          my_target: {
            files: [{
              expand: true,
              cwd: '<%= myApp.styles %>',
              src: ['angular-click2edit.css', '!*.min.css'],
              dest: '<%= myApp.dist %>',
              ext: '.min.css'
            }]
          }
        },        
        bower:{
            install:{
            }
        }
    });

    /**
     * starts a dev server at port 9000, with live-reload and runs bower just in case.
     */
    grunt.registerTask('server', function (target) {
        grunt.task.run([
            'connect:livereload',
            //'open',  // you can uncomment this and the task will open your default browser to the URL - it's a little annoying sometimes
            'watch'
        ]);
    });

    /**
     * this task builds the distribution of the application.
     * Minifies/concats etc the JS files. this is not needed for dev purposes
     */
    grunt.registerTask('build', function (target) {
        grunt.task.run([
            'clean:dist',
            'copy:dist',
            'uglify',
            'cssmin'
        ]);
    });

};
