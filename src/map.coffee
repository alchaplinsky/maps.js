class window.Map

  constructor: (@options) ->
    @element = document.querySelector(@options.div)
    if @element?
      @adapter = new GoogleMaps.Map(@element, @options)
      @markers = []

  addMarker: (options) ->
    @markers.push(@adapter.addMarker(options))

  addMarkers: (markers) ->
    @addMarker(marker) for marker in markers

  getDiv: ->
    @element

  getCenter: ->
    @adapter.getCenter()

  getZoom: ->
    @adapter.getZoom()

  setCenter: (lat, lng) ->
    @adapter.setCenter(lat, lng)

  setZoom: (number) ->
    @adapter.setZoom(number)
