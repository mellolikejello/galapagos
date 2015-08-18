var map;

function scrollToHeader() {
  $('html,body').animate({
        scrollTop: $("#header").offset().top},
        'slow');
}

function initHTML() {
  $('.button-collapse').sideNav();
  $('.parallax').parallax();
  $('#get-started-btn').click(function() {
    scrollToHeader();
  });
  $('#get-started-icon').click(function() {
    scrollToHeader();
  });
  $('.range-field #timeline-range').pushpin({ top: 100 });
  $('.drag-target').pushpin({ top: 200, right: 0 });
}

function init() {
  initHTML();
  mapExample();
  addMapTravelPoints();
}

function mapExample() {
  var GALAPAGOS_LATLNG = {"lat": -0.6667, "lng": -90.5500};
  // Create the Google Map…
  map = new google.maps.Map(d3.select("#map").node(), {
    zoom: 8,
    center: new google.maps.LatLng(GALAPAGOS_LATLNG.lat, GALAPAGOS_LATLNG.lng),
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    scrollwheel: false,
    disableDefaultUI: true,
    draggable: false
  });

  // Load the data. When the data comes back, create an overlay.
  d3.json("data/gal_places.json", function(data) {
    var places = data.features;
    var overlay = new google.maps.OverlayView();

    // Add the container when the overlay is added to the map.
    overlay.onAdd = function() {
      var layer = d3.select(this.getPanes().overlayLayer).append("div")
          .attr("class", "stations");

      // Draw each marker as a separate SVG element.
      // We could use a single SVG, but what size would it have?
      overlay.draw = function() {
        var projection = this.getProjection(),
            padding = 10;

        var marker = layer.selectAll("svg")
            .data(d3.entries(places))
            .each(transform) // update existing markers
          .enter().append("svg:svg")
            .each(transform)
            .attr("class", "marker");

        // Add a circle.
        marker.append("svg:circle")
            .attr("r", 4.5)
            .attr("cx", padding)
            .attr("cy", padding);

        // Add a label.
        marker.append("svg:text")
            .attr("x", padding + 7)
            .attr("y", padding)
            .attr("dy", ".31em")
            .text(function(d) { return d.value.properties.NAME; });

        function transform(d) {
          d = new google.maps.LatLng(d.value.properties.LATITUDE,
                                     d.value.properties.LONGITUDE);
          d = projection.fromLatLngToDivPixel(d);
          return d3.select(this)
              .style("left", (d.x - padding) + "px")
              .style("top", (d.y - padding) + "px");
        }
      };
    };

    // Bind our overlay to the map…
    overlay.setMap(map);

    google.maps.event.addDomListener(window, 'resize', function() {
      map.setCenter(GALAPAGOS_LATLNG);
    });
  });

}

function addMapTravelPoints() {
  d3.json("data/trip.json", function(data) {
    var travelPoints = data.travel;
    var coordinates = [];
    for(var i in travelPoints) {
      var startPoint = new google.maps.LatLng(travelPoints[i].start.latLng[0],
                                             travelPoints[i].start.latLng[1]);
      var endPoint = new google.maps.LatLng(travelPoints[i].end.latLng[0],
                                             travelPoints[i].end.latLng[1]);
      coordinates.push(startPoint, endPoint);
    }

    var arcPts = calculateArcPts(startPoint, endPoint);

    var poly = new google.maps.Polygon({
     paths: [arcPts],
     strokeColor: "#00FF00",
     strokeOpacity: 0.5,
     strokeWeight: 2,
     fillColor: "#FF0000",
     fillOpacity: 0.35,
     map: map
    });
//    var leg = new google.maps.Polygon( {
//      paths: coordinates,
//      strokeColor: '#000000',
//      strokeOpacity: 0.8,
//      strokeWeight: 2
////      fillColor: '#FF0000',
////      fillOpacity: 0.35
//    });
//
//    leg.setMap(map);
  });
}

//returns points of arc, calculates center point
function calculateArcPts(startPoint, endPoint) {
  var centerLng = Math.abs(startPoint.lng - endPoint.lng);
  var centerLat = Math.abs(startPoint.lat - endPoint.lat)/2 - 250;
  var center = new google.maps.LatLng(centerLng, centerLat);
  return drawArc(center, startPoint, endPoint, 250);
}

/* ---- From StackOverflow Example
http://stackoverflow.com/questions/24956616/draw-circles-arc-on-google-maps
---- */

var EarthRadiusMeters = 6378137.0; // meters
/* Based the on the Latitude/longitude spherical geodesy formulae & scripts
   at http://www.movable-type.co.uk/scripts/latlong.html
   (c) Chris Veness 2002-2010
*/ 
google.maps.LatLng.prototype.DestinationPoint = function (brng, dist) {
var R = EarthRadiusMeters; // earth's mean radius in meters
var brng = brng.toRad();
var lat1 = this.lat().toRad(), lon1 = this.lng().toRad();
var lat2 = Math.asin( Math.sin(lat1)*Math.cos(dist/R) + 
                      Math.cos(lat1)*Math.sin(dist/R)*Math.cos(brng) );
var lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(dist/R)*Math.cos(lat1), 
                             Math.cos(dist/R)-Math.sin(lat1)*Math.sin(lat2));

return new google.maps.LatLng(lat2.toDeg(), lon2.toDeg());
}

// === A function which returns the bearing between two LatLng in radians ===
// === If v1 is null, it returns the bearing between the first and last vertex ===
// === If v1 is present but v2 is null, returns the bearing from v1 to the next vertex ===
// === If either vertex is out of range, returns void ===
google.maps.LatLng.prototype.Bearing = function(otherLatLng) {
  var from = this;
  var to = otherLatLng;
  if (from.equals(to)) {
    return 0;
  }
  var lat1 = from.latRadians();
  var lon1 = from.lngRadians();
  var lat2 = to.latRadians();
  var lon2 = to.lngRadians();
  var angle = - Math.atan2( Math.sin( lon1 - lon2 ) * Math.cos( lat2 ), Math.cos( lat1 ) * Math.sin( lat2 ) - Math.sin( lat1 ) * Math.cos( lat2 ) * Math.cos( lon1 - lon2 ) );
  if ( angle < 0.0 ) angle  += Math.PI * 2.0;
  if ( angle > Math.PI ) angle -= Math.PI * 2.0; 
  return parseFloat(angle.toDeg());
}


/**
 * Extend the Number object to convert degrees to radians
 *
 * @return {Number} Bearing in radians
 * @ignore
 */ 
Number.prototype.toRad = function () {
  return this * Math.PI / 180;
};

/**
 * Extend the Number object to convert radians to degrees
 *
 * @return {Number} Bearing in degrees
 * @ignore
 */ 
Number.prototype.toDeg = function () {
  return this * 180 / Math.PI;
};

function drawArc(center, initialBearing, finalBearing, radius) {
  var EarthRadiusMeters = 6378137.0;
  var d2r = Math.PI / 180;   // degrees to radians
  var r2d = 180 / Math.PI;   // radians to degrees

  var points = 32;

  // find the raidus in lat/lon
  var rlat = (radius / EarthRadiusMeters) * r2d;
  var rlng = rlat / Math.cos(center.lat() * d2r);

  var extp = new Array();

  if (initialBearing > finalBearing) finalBearing += 360;
  var deltaBearing = finalBearing - initialBearing;
  deltaBearing = deltaBearing/points;
  for (var i=0; (i < points+1); i++)
  {
    extp.push(center.DestinationPoint(initialBearing + i*deltaBearing, radius));
    bounds.extend(extp[extp.length-1]);
  }
  return extp;
}

/* ---- End StackOverflow ---- */

window.onload = init;










