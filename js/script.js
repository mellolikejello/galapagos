var mapFromRoc, mapToGalap, mapGalapagos;
var introComplete = true;
var transitionComplete = true;
var fromRocMarkers = [];
var GALAPAGOS_LATLNG = {"lat": -0.6667, "lng": -90.5500};
var ROCHESTER_LATLNG = {"lat": 43.161030, "lng": -77.610924};
var QUITO_LATLNG = {"lat": -0.180653, "lng": -78.467834};

function scrollToHeader() {
  $('html,body').animate({
        scrollTop: $("#map-from-roc").offset().top},
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
  $(document).ready(function(){
    $('.slider').slider({full_width: false});
  });
  $('.slider').slider('start');
}

function init() {
  initHTML();
  addMapFromRoc();
  addMapToGalap();
  addMapGalapagos();
  // addMapTravelPoints();
  appendDayCards();
}

function addMapFromRoc() {
  // Create the Google Map…
  mapFromRoc = new google.maps.Map(d3.select("#map-from-roc").node(), {
    zoom: 3,
    center: new google.maps.LatLng(ROCHESTER_LATLNG.lat, ROCHESTER_LATLNG.lng),
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    scrollwheel: false,
    disableDefaultUI: true,
    draggable: false
  });

  var rocMarker = new google.maps.Marker({
    position: ROCHESTER_LATLNG,
    map: mapFromRoc,
    title: 'Rochester, NY'
  });

  var quitoMarker = new google.maps.Marker({
    position: QUITO_LATLNG,
    map: mapFromRoc,
    title: 'Quito, Ecuador'
  });

  var galapagosMarker = new google.maps.Marker({
    position: GALAPAGOS_LATLNG,
    map: mapFromRoc,
    title: 'Galapagos Islands'
  });

  var fromRocMarkers = [rocMarker, quitoMarker, galapagosMarker];

  // google.maps.event.addDomListener(window, 'click', function() {
  //   // mapFromRoc.setZoom(10); // Back to default zoom
  //   mapFromRoc.panTo(GALAPAGOS_LATLNG); // Pan map to that position
  //   setTimeout("mapFromRoc.setZoom(8)",1000); // Zoom in after 1 sec
  // });

  initIntroScrollFire();

  google.maps.event.addDomListener(window, 'resize', function() {
    // TOD0: fix error message
    mapFromRoc.setCenter(new google.maps.LatLng(ROCHESTER_LATLNG.lat, ROCHESTER_LATLNG.lng));
  });
}

function zoomToRoc() {
  mapFromRoc.setCenter(new google.maps.LatLng(ROCHESTER_LATLNG.lat, ROCHESTER_LATLNG.lng));
  mapFromRoc.setZoom(3);
}

function initIntroScrollFire() {
  if(introComplete) {
    var options = [
    {selector: '#map-from-roc', offset: 0, callback: 'Materialize.toast("Early in the morning on May 26,", 2500 )' },
    {selector: '#map-from-roc', offset: 400, callback: 'Materialize.toast("I met with my class at the Rochester Airport.", 2500 )' },
    {selector: '#map-from-roc', offset: 800, callback: 'Materialize.toast("It was just the beginning of a day of travel.", 2500 )' },
    {selector: '#map-from-roc', offset: 1000, callback: 'Materialize.toast("After a stop in Atlanta, several gate changes and delays,", 2500 )' },
    {selector: '#map-from-roc', offset: 1300, callback: 'Materialize.toast("we finally landed in Quito,", 2500 )' },
    {selector: '#map-from-roc', offset: 1400, callback: 'Materialize.toast("the capital of Ecuador!", 2500 )' },
    {selector: '#map-from-roc', offset: 1500, callback: 'zoomToEcuador()' }
    // {selector: '#staggered-test', offset: 400, callback: 'Materialize.showStaggeredList("#staggered-test")' },
    // {selector: '#image-test', offset: 500, callback: 'Materialize.fadeInImage("#image-test")' }
    ];
    Materialize.scrollFire(options);
    introComplete = false;
  }

}

function initTranScrollFire() {
  if(transitionComplete) {
    var options = [
    {selector: '#map-to-galap', offset: 2000, callback: 'Materialize.toast("As soon as we started getting used to the altitude in Quito,", 2500 )' },
    {selector: '#map-to-galap', offset: 2400, callback: 'Materialize.toast("we were flying off the Galapagos Islands,", 2500 )' },
    {selector: '#map-to-galap', offset: 2700, callback: 'Materialize.toast("where the greatest adventure awaited.", 2500 )' },
    {selector: '#map-to-galap', offset: 2800, callback: 'zoomToGalapagos()' }
    ];
    Materialize.scrollFire(options);
    transitionComplete = false;
  }

}

function smoothZoom (map, max, cnt) {
  if (cnt >= max) {
          return;
      }
  else {
      y = google.maps.event.addListener(map, 'zoom_changed', function(event){
          google.maps.event.removeListener(y);
          self.smoothZoom(map, max, cnt + 1);
      });
      setTimeout(function(){map.setZoom(cnt)}, 120);
  }
}

function zoomToEcuador() {
  introComplete = true;
  mapFromRoc.setCenter(new google.maps.LatLng(QUITO_LATLNG.lat, QUITO_LATLNG.lng));
  removeMarkers();
  smoothZoom(mapFromRoc, 7, 3);
}

function removeMarkers() {
  for(var i in fromRocMarkers) {
    fromRocMarkers[i].setMap(null);
  }
}

function addMapToGalap() {
  // Create the Google Map…
  mapToGalap = new google.maps.Map(d3.select("#map-to-galap").node(), {
    zoom: 6,
    center: new google.maps.LatLng(QUITO_LATLNG.lat, QUITO_LATLNG.lng),
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    scrollwheel: false,
    disableDefaultUI: true,
    draggable: false
  });

  google.maps.event.addDomListener(window, 'resize', function() {
    mapFromRoc.setCenter(new google.maps.LatLng(QUITO_LATLNG.lat, QUITO_LATLNG.lng));
  });
}

function zoomToGalapagos() {
  transitionComplete = true;
  mapToGalap.setCenter(new google.maps.LatLng(GALAPAGOS_LATLNG.lat, GALAPAGOS_LATLNG.lng));
  smoothZoom(mapToGalap, 7, 6);
}

function addMapGalapagos() {
  // Create the Google Map…
  mapGalapagos = new google.maps.Map(d3.select("#map-galapagos").node(), {
    zoom: 8,
    center: new google.maps.LatLng(GALAPAGOS_LATLNG.lat, GALAPAGOS_LATLNG.lng),
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    scrollwheel: false,
    disableDefaultUI: true,
    draggable: false
  });

  // Load the data. When the data comes back, create an overlay.
  // d3.json("data/gal_places.json", function(data) {
  //   var places = data.features;
  //   var overlay = new google.maps.OverlayView();

  //   // Add the container when the overlay is added to the map.
  //   overlay.onAdd = function() {
  //     var layer = d3.select(this.getPanes().overlayLayer).append("div")
  //         .attr("class", "stations");

  //     // Draw each marker as a separate SVG element.
  //     // We could use a single SVG, but what size would it have?
  //     overlay.draw = function() {
  //       var projection = this.getProjection(),
  //           padding = 10;

  //       var marker = layer.selectAll("svg")
  //           .data(d3.entries(places))
  //           .each(transform) // update existing markers
  //         .enter().append("svg:svg")
  //           .each(transform)
  //           .attr("class", "marker");

  //       // Add a circle.
  //       marker.append("svg:circle")
  //           .attr("r", 4.5)
  //           .attr("cx", padding)
  //           .attr("cy", padding);

  //       // Add a label.
  //       marker.append("svg:text")
  //           .attr("x", padding + 7)
  //           .attr("y", padding)
  //           .attr("dy", ".31em")
  //           .text(function(d) { return d.value.properties.NAME; });

  //       function transform(d) {
  //         d = new google.maps.LatLng(d.value.properties.LATITUDE,
  //                                    d.value.properties.LONGITUDE);
  //         d = projection.fromLatLngToDivPixel(d);
  //         return d3.select(this)
  //             .style("left", (d.x - padding) + "px")
  //             .style("top", (d.y - padding) + "px");
  //       }
  //     };
  //   };

    // Bind our overlay to the map…
    // overlay.setMap(map);

  google.maps.event.addDomListener(window, 'resize', function() {
    mapGalapagos.setCenter(GALAPAGOS_LATLNG);
  });
}

function appendDayCards() {
  var card_element = document.querySelector(".day-card-main");
  var parent = document.querySelector("#day-list");
  parent.removeChild(card_element);
  d3.json("data/trip.json", function(data) {
    var days = data.itinerary;

    for(var i in days) {
      // skip day one
      if(i != 0 && i != 1) {
        var cur_data = days[i];
        var cur_element = card_element.cloneNode(true);
        var curDayNum = Number(i)+ 1;
        // change to title
        cur_element.querySelector(".day-date").textContent = "Day " + curDayNum;
        //sub title
        cur_element.querySelector(".day-title").textContent = cur_data.title;
        cur_element.querySelector(".date-title").textContent = cur_data.date;
        // change this to textConect later ;) bad moves
        cur_element.querySelector(".card-desc").innerHTML = cur_data.description;
        if(cur_data.thumb != 'link') {
          cur_element.querySelector(".day-thumb").src = cur_data.thumb;
        } else {
          cur_element.querySelector(".day-thumb").src = "http://i.imgur.com/zVPCJUb.jpg";
        }
        parent.appendChild(cur_element);
      }
    }
  }) ;
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

//    var arcPts = calculateArcPts(startPoint, endPoint);
//
//    var poly = new google.maps.Polygon({
//     paths: [arcPts],
//     strokeColor: "#00FF00",
//     strokeOpacity: 0.5,
//     strokeWeight: 2,
//     fillColor: "#FF0000",
//     fillOpacity: 0.35,
//     map: map
//    });
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

////returns points of arc, calculates center point
//function calculateArcPts(startPoint, endPoint) {
//  var centerLng = Math.abs(startPoint.lng - endPoint.lng);
//  var centerLat = Math.abs(startPoint.lat - endPoint.lat)/2 - 250;
//  var center = new google.maps.LatLng(centerLng, centerLat);
//  return drawArc(center, startPoint, endPoint, 250);
//}
//
///* ---- From StackOverflow Example
//http://stackoverflow.com/questions/24956616/draw-circles-arc-on-google-maps
//---- */
//
//var EarthRadiusMeters = 6378137.0; // meters
///* Based the on the Latitude/longitude spherical geodesy formulae & scripts
//   at http://www.movable-type.co.uk/scripts/latlong.html
//   (c) Chris Veness 2002-2010
//*/ 
//google.maps.LatLng.prototype.DestinationPoint = function (brng, dist) {
//var R = EarthRadiusMeters; // earth's mean radius in meters
//var brng = brng.toRad();
//var lat1 = this.lat().toRad(), lon1 = this.lng().toRad();
//var lat2 = Math.asin( Math.sin(lat1)*Math.cos(dist/R) + 
//                      Math.cos(lat1)*Math.sin(dist/R)*Math.cos(brng) );
//var lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(dist/R)*Math.cos(lat1), 
//                             Math.cos(dist/R)-Math.sin(lat1)*Math.sin(lat2));
//
//return new google.maps.LatLng(lat2.toDeg(), lon2.toDeg());
//}
//
//// === A function which returns the bearing between two LatLng in radians ===
//// === If v1 is null, it returns the bearing between the first and last vertex ===
//// === If v1 is present but v2 is null, returns the bearing from v1 to the next vertex ===
//// === If either vertex is out of range, returns void ===
//google.maps.LatLng.prototype.Bearing = function(otherLatLng) {
//  var from = this;
//  var to = otherLatLng;
//  if (from.equals(to)) {
//    return 0;
//  }
//  var lat1 = from.latRadians();
//  var lon1 = from.lngRadians();
//  var lat2 = to.latRadians();
//  var lon2 = to.lngRadians();
//  var angle = - Math.atan2( Math.sin( lon1 - lon2 ) * Math.cos( lat2 ), Math.cos( lat1 ) * Math.sin( lat2 ) - Math.sin( lat1 ) * Math.cos( lat2 ) * Math.cos( lon1 - lon2 ) );
//  if ( angle < 0.0 ) angle  += Math.PI * 2.0;
//  if ( angle > Math.PI ) angle -= Math.PI * 2.0; 
//  return parseFloat(angle.toDeg());
//}
//
//
///**
// * Extend the Number object to convert degrees to radians
// *
// * @return {Number} Bearing in radians
// * @ignore
// */ 
//Number.prototype.toRad = function () {
//  return this * Math.PI / 180;
//};
//
///**
// * Extend the Number object to convert radians to degrees
// *
// * @return {Number} Bearing in degrees
// * @ignore
// */ 
//Number.prototype.toDeg = function () {
//  return this * 180 / Math.PI;
//};
//
//function drawArc(center, initialBearing, finalBearing, radius) {
//  var EarthRadiusMeters = 6378137.0;
//  var d2r = Math.PI / 180;   // degrees to radians
//  var r2d = 180 / Math.PI;   // radians to degrees
//
//  var points = 32;
//
//  // find the raidus in lat/lon
//  var rlat = (radius / EarthRadiusMeters) * r2d;
//  var rlng = rlat / Math.cos(center.lat() * d2r);
//
//  var extp = new Array();
//
//  if (initialBearing > finalBearing) finalBearing += 360;
//  var deltaBearing = finalBearing - initialBearing;
//  deltaBearing = deltaBearing/points;
//  for (var i=0; (i < points+1); i++)
//  {
//    extp.push(center.DestinationPoint(initialBearing + i*deltaBearing, radius));
//    bounds.extend(extp[extp.length-1]);
//  }
//  return extp;
//}

/* ---- End StackOverflow ---- */

function scrollHandler(e) {
  if(e.pageY == 0) {
    initIntroScrollFire();
    initTranScrollFire();
    zoomToRoc();
    mapToGalap.setCenter(new google.maps.LatLng(QUITO_LATLNG.lat, QUITO_LATLNG.lng));
    mapToGalap.setZoom(6);
  }
}

window.onload = init;
window.onscroll = scrollHandler;










