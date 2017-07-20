let newPlace;

function initMap() {

  var centerBCN = {
  	lat: 41.390205,
  	lng: 2.154007
  };

  var map = new google.maps.Map(
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
      var youAreHere = new google.maps.Marker({
        position: {
          lat: user_location.lat,
          lng: user_location.lng
        },
        map: map,
        title: "You are here"
      });

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
      "googleID": place.id
    };

    infowindow.setContent(`<div>
      <h3>${place.name}</h3>
      <p>${address}</p>
      <button onclick="sentPlace()">Join!</button>
    </div>`);
    infowindow.open(map, marker);
  });

  // Search anything
  // autocomplete.setTypes([]);

  // Only search establishments
  autocomplete.setTypes(['establishment']);
}

function sentPlace() {
  // console.log("Éxito!");
  // console.log(place);
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

$(document).ready(function() {
  initMap();
});
