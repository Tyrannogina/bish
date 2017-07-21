let newPlace;
let map;

function initMap() {

  var centerBCN = {
  	lat: 41.390205,
  	lng: 2.154007
  };

  map = new google.maps.Map(
    document.getElementById('map'),
    {
      zoom: 15,
      center: centerBCN,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false
    }
  );

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const user_location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Center map with user location
      map.setCenter(user_location);

      // Add a marker for your user location
      // var youAreHere = new google.maps.Marker({
      //   position: {
      //     lat: user_location.lat,
      //     lng: user_location.lng
      //   },
      //   map: map,
      //   title: "You are here"
      // });

    }, function () {
      console.log('Error in the geolocation service.');
    });
  } else {
    console.log('Browser does not support geolocation.');
  }

  var input = /** @type {!HTMLInputElement} */(
    document.getElementById('searchPlace'));

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    let place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(15);  // Why 17? Because it looks good.
    }
    marker.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    newPlace = {
      "name": place.name,
      "lat": place.geometry.location.lat(),
      "lng": place.geometry.location.lng(),
      "googleID": place.id,
      "icon": place.icon
    };

    infowindow.setContent(`<div>
      <h3>${place.name}</h3>
      <p>${address}</p>
      <button onclick="sentPlace(); getMarkers()">Join!</button>
    </div>`);
    infowindow.open(map, marker);
  });

  // function getMarkers() {
  //   $.ajax({
  //     url: '/markers',
  //     method: 'GET',
  //     success: showMarkers,
  //     error: function(error) {
  //       console.log("error:", error);
  //     }
  //   });
  // }
  //
  // function showMarkers(places) {
  //
  //   var bounds = new google.maps.LatLngBounds();
  //
  //   // Info Window Content
  //   // var infoWindowContent = [
  //   //     ['<div class="info_content">' +
  //   //     '<h3>London Eye</h3>' +
  //   //     '<p>The London Eye is a giant Ferris wheel situated on the banks of the River Thames. The entire structure is 135 metres (443 ft) tall and the wheel has a diameter of 120 metres (394 ft).</p>' +        '</div>'],
  //   //     ['<div class="info_content">' +
  //   //     '<h3>Palace of Westminster</h3>' +
  //   //     '<p>The Palace of Westminster is the meeting place of the House of Commons and the House of Lords, the two houses of the Parliament of the United Kingdom. Commonly known as the Houses of Parliament after its tenants.</p>' +
  //   //     '</div>']
  //   // ];
  //   var infoWindowContent = [];
  //
  //   for (i = 0; i < places.length; i++) {
  //     let content = `<div><h4>${places[i].name}</h4><button onclick="sentPlace()">Join!</button></div>`;
  //     infoWindowContent.push(content);
  //   }
  //
  //   // var markers = places;
  //   // Display multiple markers on a map
  //   var infoWindow = new google.maps.InfoWindow(), marker, i;
  //
  //   // Loop through our array of markers & place each one on the map
  //   for (i = 0; i < places.length; i++) {
  //     var position = new google.maps.LatLng(places[i].location.coordinates[1], places[i].location.coordinates[0]);
  //     bounds.extend(position);
  //     marker = new google.maps.Marker({
  //       position: position,
  //       map: map,
  //       title: places[i].name
  //     });
  //
  //     // var infoWindowContent = `<div><h3>${places[i].name}</h3></div>`;
  //
  //     // Allow each marker to have an info window
  //     google.maps.event.addListener(marker, 'click', (function(marker, i) {
  //       return function() {
  //         infoWindow.setContent(infoWindowContent[i]);
  //         infoWindow.open(map, marker);
  //       };
  //     })(marker, i));
  //
  //     // Automatically center the map fitting all markers on the screen
  //     map.fitBounds(bounds);
  //   }
  //
  //   // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
  //   var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
  //       this.setZoom(14);
  //       google.maps.event.removeListener(boundsListener);
  //   });
  //
  //
  //   console.log("My places are:", places);
  // }

  getMarkers();

  // Search anything
  // autocomplete.setTypes([]);

  // Only search establishments
  autocomplete.setTypes(['establishment']);
}

function sentPlace() {
  $.ajax({
    url: '/secret',
    method: 'PUT',
    data: newPlace,
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.log("error:", error);
    }
  });
}

function getMarkers() {
  $.ajax({
    url: '/markers',
    method: 'GET',
    success: showMarkers,
    error: function(error) {
      console.log("error:", error);
    }
  });
}

function showMarkers(places) {

  var bounds = new google.maps.LatLngBounds();

  var infoWindowContent = [];

  for (i = 0; i < places.length; i++) {
    let content = `<div><h4><a href="/secret/places/${places[i]._id}">${places[i].name}</a></h4><button onclick="sentPlace()">Join!</button></div>`;
    infoWindowContent.push(content);
  }

  // var markers = places;
  // Display multiple markers on a map
  var infoWindow = new google.maps.InfoWindow(), marker, i;

  // Loop through our array of markers & place each one on the map
  for (i = 0; i < places.length; i++) {
    var position = new google.maps.LatLng(places[i].location.coordinates[1], places[i].location.coordinates[0]);
    bounds.extend(position);
    marker = new google.maps.Marker({
      position: position,
      map: map,
      title: places[i].name
    });

    marker.setIcon(/** @type {google.maps.Icon} */({
      url: places[i].icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    // var infoWindowContent = `<div><h3>${places[i].name}</h3></div>`;

    // Allow each marker to have an info window
    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        infoWindow.setContent(infoWindowContent[i]);
        infoWindow.open(map, marker);
      };
    })(marker, i));

    // Automatically center the map fitting all markers on the screen
    map.fitBounds(bounds);
  }

  // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
  var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
      this.setZoom(14);
      google.maps.event.removeListener(boundsListener);
  });


  console.log("My places are:", places);
}

// function getMarkers() {
//   $.ajax({
//     url: '/markers',
//     method: 'GET',
//     success: showMarkers,
//     error: function(error) {
//       console.log("error:", error);
//     }
//   });
// }
//
// function showMarkers(places) {
//   console.log("My places are:", places);
// }


$(document).ready(function() {
  initMap();
});
