window.GoogleMaps = {}

class GoogleMaps.Api

  constructor: ->
    unless window.google && window.google.maps
      console.warn "Google Maps API is required. Add this script http://maps.google.com/maps/api/js?sensor=true to a page."
    else
      @provider = window.google.maps

  controlPosition: (position) ->
    @provider.ControlPosition[position.toUpperCase()]

  latLng: (lat, lng) ->
    new @provider.LatLng(lat, lng)

  geocodeStatusOk: ->
    @provider.GeocoderStatus.OK

  mapTypeIds: (types) ->
    ids = []
    ids.push(@mapType(type)) for type in types
    ids

  mapType: (type) ->
    @provider.MapTypeId[type.toUpperCase()]

  mapAnimation: (type) ->
    @provider.Animation[type.toUpperCase()]

  controlPosition: (type) ->
    @provider.ControlPosition[type.toUpperCase()]

  controlStyle: (control, style) ->
    name = control+'ControlStyle'
    name = name.charAt(0).toUpperCase() + name.slice(1)
    @provider[name][style.toUpperCase()]
