function init() {
  mapExample();
}

function mapExample() {
  var GALAPAGOS_LATLNG = {"lat": -0.6667, "lng": -90.5500};
  // Create the Google Map…
  var map = new google.maps.Map(d3.select("#map").node(), {
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

window.onload = init;