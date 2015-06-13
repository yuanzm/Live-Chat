module.exports = (grunt)->

    stringify = require 'stringify'
    coffeeify = require 'coffeeify'

    grunt.initConfig
        copy:
            dev:
                files: [
                    {src: ["lib/jquery/dist/jquery.min.js"], dest: 'dist/lib/jquery.min.js'},
                    {src: ["lib/jquery/dist/jquery.min.map"], dest: 'dist/lib/jquery.min.map'},
                    {src: ["lib/socket.io-1.3.5.js"], dest: 'dist/lib/socket.io-1.3.5.js'}
                ]
        clean:
            dist: ['dist']

        browserify:
            components:
                options:
                  preBundleCB: (b)->
                    b.transform(coffeeify)
                    b.transform(stringify({extensions: ['.hbs', '.html', '.tpl', '.txt']}))
                expand: true
                flatten: true
                files: {
                    'dist/js/components.js': ['src/components/**/*.coffee']
                    'dist/js/common.js': ['src/common/**/*.coffee'],
                }

            pages:
                options:
                  preBundleCB: (b)->
                    b.transform(coffeeify)
                    b.transform(stringify({extensions: ['.hbs', '.html', '.tpl', '.txt']}))
                expand: true
                flatten: true
                src: ['src/pages/**/*.coffee']
                dest: 'dist/js/pages/'
                ext: '.js'

        watch:
            compile:
                files: ['src/**/*.less', 'src/**/*.coffee']
                tasks: ['browserify', 'less']

        less:
            components:
                files:
                    'dist/css/layout.css': ['src/components/**/*.less', 'src/common/**/*.less']
                    'dist/css/signup.css': ['src/pages/sign/signup.less']
                    'dist/css/signin.css': ['src/pages/sign/signin.less']
                    'dist/css/chat.css': ['src/pages/chat/chat.less']

    grunt.loadNpmTasks 'grunt-browserify'
    grunt.loadNpmTasks 'grunt-contrib-less'
    grunt.loadNpmTasks 'grunt-contrib-copy'
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-contrib-less'

    grunt.registerTask 'default', ->
        grunt.task.run [
            'clean'
            'copy'
            'browserify'
            'less'
            'watch'
        ]
