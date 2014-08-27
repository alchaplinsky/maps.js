class GoogleMaps.Marker

  constructor: (params, @api, @parent) ->
    @marker = new @api.provider.Marker @markerOptions(params)
    @addInfoWindow(@marker, params.info) if params.info

  addInfoWindow: (marker, info) ->
    info.content = "<div id='content'>#{info.content}</div>"
    infoWindow = new @api.provider.InfoWindow info
    @api.provider.event.addListener marker, 'click', =>
      infoWindow.open @parent.map, marker

  markerOptions: (params) ->
    throw new Error "You must specify lat and lng params for addMarker()." unless params.lat and params.lng
    options = params
    options.map = @parent.map
    options.animation = @api.mapAnimation(params.animation) if params.animation
    options.position = @api.latLng(params.lat, params.lng)
    options.title = params?.title
    options
