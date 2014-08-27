module.exports = (grunt) ->

  grunt.loadNpmTasks('grunt-contrib-coffee')

  grunt.initConfig

    coffee:
      compile:
        files:
          'maps.js': ['src/google_maps/*.coffee', 'src/map.coffee']

  grunt.registerTask('default', ['coffee:compile'])
