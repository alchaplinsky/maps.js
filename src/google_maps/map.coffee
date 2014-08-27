class GoogleMaps.Map

  constructor: (@element, params) ->
    @api =  new GoogleMaps.Api()
    options = {}
    options.zoom = params?.zoom || 1
    options.mapTypeId = @api.mapType(params.type) if params.type
    options = @setControls(options, params)
    if params.geo
      @createByGeocode(options, params)
    else
      @createByLatLng(options, params)

  createByGeocode: (options, params) ->
    @geocode params.geo, (results) =>
      options.center = results[0].geometry.location
      @createMap(options, params.markers)
      @fitBounds(results[0].geometry.viewport)

  createByLatLng: (options, params) ->
    lat = params?.lat || 0
    lng = params?.lng || 0
    options.center = @api.latLng(lat, lng)
    @createMap(options, params.markers)

  createMap: (options, markers = []) ->
    @map = new @api.provider.Map @element, options
    @addMarker(marker) for marker in markers

  setControls: (options, params) ->
    for control, settings of params.controls
      name = control+"Control"
      if typeof settings is 'boolean'
        options[name] = settings
      else
        options[name] = true
        options[control+'ControlOptions'] = @setControlOptions(control, settings)
    options

  setControlOptions: (control, settings) ->
    options = {}
    options.mapTypeIds = @api.mapTypeIds(settings.mapTypeIds) if control is 'mapType' && settings.mapTypeIds
    options.opened = settings.opened if control is 'overviewMap' && settings.opened
    options.position = @api.controlPosition(settings.position) if settings.position
    options.style = @api.controlStyle(control, settings.style) if settings.style
    options

  addMarker: (params) ->
    new GoogleMaps.Marker(params, @api, @)

  getCenter: ->
    @map.getCenter()

  getZoom: ->
    @map.getZoom()

  setCenter: (lat, lng) ->
    @map.setCenter @api.latLng(lat, lng)

  setZoom: (number) ->
    @map.setZoom(number)

  fitBounds: (bounds) ->
    @map.fitBounds(bounds)

  geocode: (name, callback) ->
    @geocoder = new @api.provider.Geocoder()
    @geocoder.geocode address: name, (results, status) =>
      if status is @api.provider.GeocoderStatus.OK
        callback(results)
      else
        console.warn "Geocode was not successful for the following reason: #{status}"
