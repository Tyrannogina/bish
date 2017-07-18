function startMap() {
  var ironhackBCN = {
  	lat: 41.3977381,
  	lng: 2.190471916};
  var map = new google.maps.Map(
    document.getElementById('map'),
    {
      zoom: 15,
      center: ironhackBCN
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
      // var IronHackBCNMarker = new google.maps.Marker({
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

  return map;

  // directionsDisplay.setMap(map);
}

$(document).ready(function() {

	var map = startMap();

  function initAutocomplete() {
        // var map = new google.maps.Map(document.getElementById('map'), {
        //   center: {lat: -33.8688, lng: 151.2195},
        //   zoom: 13,
        //   mapTypeId: 'roadmap'
        // });

        // Create the search box and link it to the UI element.
        var input = document.getElementById('searchPlace');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length === 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
      }

  initAutocomplete();

  // var geocoder = new google.maps.Geocoder();
  //
  // document.getElementById('searchPlace').addEventListener('click', function() {
  //   geocodeAddress(geocoder, map);
  // });
  //
  // function geocodeAddress(geocoder, resultsMap) {
	//   var address = document.getElementById('address').value;
  //
	//   geocoder.geocode({'address': address}, function(results, status) {
	//     if (status === 'OK') {
	//       resultsMap.setCenter(results[0].geometry.location);
	//       var marker = new google.maps.Marker({
	//         map: resultsMap,
	//         position: results[0].geometry.location
	//       });
	//       // document.getElementById('latitude').value = results[0].geometry.location.lat();
	//       // document.getElementById('longitude').value = results[0].geometry.location.lng();
  //       console.log(results[0].geometry);
	//     } else {
	//       alert('Geocode was not successful for the following reason: ' + status);
	//     }
	//   });
	// }
});
