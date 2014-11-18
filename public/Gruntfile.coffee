module.exports = (grunt) ->
	coffeeify = require("coffeeify")
	stringify = require("stringify")

	grunt.initConfig
		# Start a connect web server.
		connect:
			options:
				port: 8000
				hostname: '127.0.0.1'
				livereload: 35729
		
		# Clean files and folders
		clean:
			bin: ["bin"]
			dist: ["dist"]
			sassCache: '.sass-cache'

		# Copy files and folders
		copy:
			assets:
				src: "assets/**/*"
				dest: "dist/"
			lib:
				src: "lib/**/*"
				dest: "dist/"

		# Grunt task for node-browserify
		browserify:
			dev:
                options:
                    preBundleCB: (b)->
                        b.transform(coffeeify)
                        b.transform(stringify({extensions: [".html"]}))
                expand: true
                flatten: true
                src: ["src/coffee/main.coffee"]
                dest: "bin/js"
                ext: ".js"
            test:
            	options:
            		preBundleCB: (b)->
            			b.transform(coffeeify)
            			b.transform(stringify({extensions: [".html"]}))
            	expand: true
            	flatten: true
            	src: ["test/test.coffee"]
            	dest: "bin/test"
            	ext: ".js"
		# Minify files with UglifyJS
		uglify:
			build:
				files: [{
				    expand: true
				    cwd: 'bin/js'
				    src: '**/*.js'
				    dest: 'dist/js'
				}]
		# Compress CSS files
		cssmin:    
		    build:
		        files:
		            "dist/css/main.css": ["bin/css/main.css"]

		# Run predefined tasks whenever watched file patterns are added, changed or deleted	
		watch:
			livereload:
				options:
					livereload: '<%=connect.options.livereload%>'

				files: [
					"src/**/*.coffee"
					"src/**/*.scss"
					"test/**/*.coffee"
					"test/**/*.html"
				]
			compile:
				files: [
					"src/**/*.coffee"
					"src/**/*.scss"
					"test/**/*.coffee"
					"test/**/*.html"

				]
				tasks: ["browserify", "sass"]

		# Compile Sass to CSS
		sass:
			dist:
				files:
					"bin/css/main.css": "src/scss/main.scss"
		mocha:
	        test:
	            src: ["test/**/*.html"]
	            options:
	                run: true
	                reporter: "Spec"

	grunt.loadNpmTasks "grunt-contrib-clean"
	grunt.loadNpmTasks "grunt-contrib-connect"
	grunt.loadNpmTasks "grunt-browserify"
	grunt.loadNpmTasks "grunt-contrib-watch"
	grunt.loadNpmTasks "grunt-contrib-sass"
	grunt.loadNpmTasks "grunt-contrib-uglify"
	grunt.loadNpmTasks "grunt-contrib-cssmin"
	grunt.loadNpmTasks "grunt-contrib-copy"
	grunt.loadNpmTasks "grunt-contrib-jade"
	grunt.loadNpmTasks "grunt-mocha"

	grunt.registerTask "default", ->
		grunt.task.run [
			"connect"
			"clean:bin"
			"browserify"
			"sass"
			# "mocha"
			"watch"
		]

	grunt.registerTask "build", ->
		grunt.task.run [
			"clean:bin"
			"clean:dist"
			"browserify"
			"sass"
			# "mocha"
			"clean:sassCache"
			"cssmin"
			"uglify"
			"copy"
		]
