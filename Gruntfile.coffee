module.exports = (grunt)->

    grunt.initConfig
        nodemon:
            dev: 
                script: "debug.coffee"
                options:
                    ext: "js,coffee,jade"
                    debug: true


    grunt.loadNpmTasks 'grunt-nodemon'

    grunt.registerTask('default', ['nodemon'])