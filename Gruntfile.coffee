module.exports = (grunt) ->

  require('load-grunt-tasks')(grunt)

  grunt.initConfig

    coffee:
      compile:
        files:
          'maps.js': ['src/google_maps/*.coffee', 'src/map.coffee']
      dist:
        files:
          'development/maps.js': ['src/google_maps/*.coffee', 'src/map.coffee']
    watch:
      coffee:
        files: ['src/**/*.coffee']
        tasks: ['coffee:dist']
      livereload:
        options:
          livereload: '<%= connect.options.livereload %>'
        files: ['development/{,*/}*.js',]
    connect:
      options:
        port: 9000
        open: true
        livereload: 35729,
        hostname: 'localhost'
      livereload:
        options:
          middleware: (connect)-> [
            connect().use('/bower_components', connect.static('./bower_components')),
            connect.static('development')
          ]

  grunt.registerTask('default', ['coffee:compile'])
  grunt.registerTask('serve', ['connect:livereload', 'coffee:dist', 'watch'])
