# Maps.js - Google Maps JavaScript API V3
Maps.js A Javascript library for working with Google Maps JavaScript API V3.
Gives you declarative way of creating maps and simplifies manipulating with maps after they're created.

## Build
To build maps.js from the source, you'll need node.js and npm.

    git clone https://github.com/alchapone/maps.js.git
    cd maps.js
    npm install
    grunt

## Usage
To Build Google Map wit Maps.js you need to follow 3 simple steps:

1. Add Google Maps API script to your HTML:

  `<script src="http://maps.google.com/maps/api/js?sensor=true"></script>`

2. Create a container for map with fixed height in your HTML:

  `<div id="worldmap" style="height: 500px;"></div>`

3. Create a new instance of `Map` function with parameters:

  - To create a world map - minimum parameters required:

          map1 = new Map({
            div: '#worldmap'
          });

  - You can set center and zoom level for map

          map2 = new Map({
            div: '#sidneymap',
            lat: -33.867365,
            lng: 151.203957,
            zoom: 8
          });

  - Easily add markers with info windows during map creation

          map3 = new Map({
            div: '#sidneymap',
            lat: -33.867365,
            lng: 151.203957,
            zoom: 8,
            markers: [{
              lat: -33.867365,
              lng: 151.2039,
              title: 'Sidney',
              animation: 'drop',
              info:
                content: 'Welcome to Sidney!'
            }]
          });

  - Use goecode features without specifying lattitude and longitude

          map4 = new Map({
            div: '#map2',
            geo: 'Munich'
          });
