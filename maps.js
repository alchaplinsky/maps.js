(function() {
  window.GoogleMaps = {};

  GoogleMaps.Api = (function() {
    function Api() {
      if (!(window.google && window.google.maps)) {
        console.warn("Google Maps API is required. Add this script http://maps.google.com/maps/api/js?sensor=true to a page.");
      } else {
        this.provider = window.google.maps;
      }
    }

    Api.prototype.controlPosition = function(position) {
      return this.provider.ControlPosition[position.toUpperCase()];
    };

    Api.prototype.latLng = function(lat, lng) {
      return new this.provider.LatLng(lat, lng);
    };

    Api.prototype.geocodeStatusOk = function() {
      return this.provider.GeocoderStatus.OK;
    };

    Api.prototype.mapTypeIds = function(types) {
      var ids, type, _i, _len;
      ids = [];
      for (_i = 0, _len = types.length; _i < _len; _i++) {
        type = types[_i];
        ids.push(this.mapType(type));
      }
      return ids;
    };

    Api.prototype.mapType = function(type) {
      return this.provider.MapTypeId[type.toUpperCase()];
    };

    Api.prototype.mapAnimation = function(type) {
      return this.provider.Animation[type.toUpperCase()];
    };

    Api.prototype.controlPosition = function(type) {
      return this.provider.ControlPosition[type.toUpperCase()];
    };

    Api.prototype.controlStyle = function(control, style) {
      var name;
      name = control + 'ControlStyle';
      name = name.charAt(0).toUpperCase() + name.slice(1);
      return this.provider[name][style.toUpperCase()];
    };

    return Api;

  })();

}).call(this);

(function() {
  GoogleMaps.Map = (function() {
    Map.prototype.mapOptions = ['backgroundColor', 'disableDefaultUI', 'disableDoubleClickZoom', 'draggable', 'draggableCursor', 'draggingCursor', 'heading', 'keyboardShortcuts', 'mapMaker', 'maxZoom', 'minZoom', 'noClear', 'scrollwheel', 'tilt'];

    function Map(element, params) {
      var option, options, _i, _len, _ref;
      this.element = element;
      this.api = new GoogleMaps.Api();
      options = {};
      options.zoom = (params != null ? params.zoom : void 0) || 1;
      if (params.type) {
        options.mapTypeId = this.api.mapType(params.type);
      }
      options = this.setControls(options, params);
      _ref = this.mapOptions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        if (params[option]) {
          options[option] = params[option];
        }
      }
      if (params.geo) {
        this.createByGeocode(options, params);
      } else {
        this.createByLatLng(options, params);
      }
    }

    Map.prototype.createByGeocode = function(options, params) {
      return this.geocode(params.geo, (function(_this) {
        return function(results) {
          var marker, _i, _len, _ref, _ref1;
          options.center = results[0].geometry.location;
          _this.createMap(options);
          _this.fitBounds(results[0].geometry.viewport);
          if (params.markers) {
            _ref = params.markers;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              marker = _ref[_i];
              _this.addMarker(marker);
            }
          }
          return (_ref1 = params.onGeoSuccess) != null ? _ref1.call(_this) : void 0;
        };
      })(this), function() {
        var _ref;
        return (_ref = params.onGeoFail) != null ? _ref.call(this) : void 0;
      });
    };

    Map.prototype.createByLatLng = function(options, params) {
      var lat, lng, marker, _i, _len, _ref, _results;
      lat = (params != null ? params.lat : void 0) || 0;
      lng = (params != null ? params.lng : void 0) || 0;
      options.center = this.api.latLng(lat, lng);
      this.createMap(options);
      if (params.markers) {
        _ref = params.markers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          marker = _ref[_i];
          _results.push(this.addMarker(marker));
        }
        return _results;
      }
    };

    Map.prototype.createMap = function(options) {
      return this.map = new this.api.provider.Map(this.element, options);
    };

    Map.prototype.setControls = function(options, params) {
      var control, name, settings, _ref;
      _ref = params.controls;
      for (control in _ref) {
        settings = _ref[control];
        name = control + "Control";
        if (typeof settings === 'boolean') {
          options[name] = settings;
        } else {
          options[name] = true;
          options[control + 'ControlOptions'] = this.setControlOptions(control, settings);
        }
      }
      return options;
    };

    Map.prototype.setControlOptions = function(control, settings) {
      var options;
      options = {};
      if (control === 'mapType' && settings.mapTypeIds) {
        options.mapTypeIds = this.api.mapTypeIds(settings.mapTypeIds);
      }
      if (control === 'overviewMap' && settings.opened) {
        options.opened = settings.opened;
      }
      if (settings.position) {
        options.position = this.api.controlPosition(settings.position);
      }
      if (settings.style) {
        options.style = this.api.controlStyle(control, settings.style);
      }
      return options;
    };

    Map.prototype.addMarker = function(params) {
      return new GoogleMaps.Marker(params, this.api, this);
    };

    Map.prototype.getCenter = function() {
      return this.map.getCenter();
    };

    Map.prototype.getZoom = function() {
      return this.map.getZoom();
    };

    Map.prototype.setCenter = function(lat, lng) {
      return this.map.setCenter(this.api.latLng(lat, lng));
    };

    Map.prototype.setZoom = function(number) {
      return this.map.setZoom(number);
    };

    Map.prototype.fitBounds = function(bounds) {
      return this.map.fitBounds(bounds);
    };

    Map.prototype.geocode = function(name, success, fail) {
      this.geocoder = new this.api.provider.Geocoder();
      return this.geocoder.geocode({
        address: name
      }, (function(_this) {
        return function(results, status) {
          if (status === _this.api.geocodeStatusOk()) {
            return success(results);
          } else {
            console.warn("Geocode was not successful for the following reason: " + status);
            return fail();
          }
        };
      })(this));
    };

    return Map;

  })();

}).call(this);

(function() {
  GoogleMaps.Marker = (function() {
    function Marker(params, api, parent) {
      this.api = api;
      this.parent = parent;
      this.marker = new this.api.provider.Marker(this.markerOptions(params));
      if (params.info) {
        this.addInfoWindow(this.marker, params.info);
      }
    }

    Marker.prototype.addInfoWindow = function(marker, info) {
      var infoWindow;
      info.content = "<div id='content'>" + info.content + "</div>";
      infoWindow = new this.api.provider.InfoWindow(info);
      return this.api.provider.event.addListener(marker, 'click', (function(_this) {
        return function() {
          return infoWindow.open(_this.parent.map, marker);
        };
      })(this));
    };

    Marker.prototype.markerOptions = function(params) {
      var options;
      if (!(params.lat && params.lng)) {
        throw new Error("You must specify lat and lng params for addMarker().");
      }
      options = params;
      options.map = this.parent.map;
      if (params.animation) {
        options.animation = this.api.mapAnimation(params.animation);
      }
      options.position = this.api.latLng(params.lat, params.lng);
      options.title = params != null ? params.title : void 0;
      return options;
    };

    return Marker;

  })();

}).call(this);

(function() {
  window.Map = (function() {
    function Map(options) {
      this.options = options;
      this.element = document.querySelector(this.options.div);
      if (this.element != null) {
        this.adapter = new GoogleMaps.Map(this.element, this.options);
        this.markers = [];
      }
    }

    Map.prototype.addMarker = function(options) {
      return this.markers.push(this.adapter.addMarker(options));
    };

    Map.prototype.addMarkers = function(markers) {
      var marker, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = markers.length; _i < _len; _i++) {
        marker = markers[_i];
        _results.push(this.addMarker(marker));
      }
      return _results;
    };

    Map.prototype.getDiv = function() {
      return this.element;
    };

    Map.prototype.getCenter = function() {
      return this.adapter.getCenter();
    };

    Map.prototype.getZoom = function() {
      return this.adapter.getZoom();
    };

    Map.prototype.setCenter = function(lat, lng) {
      return this.adapter.setCenter(lat, lng);
    };

    Map.prototype.setZoom = function(number) {
      return this.adapter.setZoom(number);
    };

    return Map;

  })();

}).call(this);
