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
    zoom: 3,
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
    var leg = new google.maps.Polygon( {
      paths: coordinates,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2
//      fillColor: '#FF0000',
//      fillOpacity: 0.35
    });

    leg.setMap(map);
  });
}

window.onload = init;