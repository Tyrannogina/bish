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

  var geocoder = new google.maps.Geocoder();

  document.getElementById('searchPlace').addEventListener('click', function() {
    geocodeAddress(geocoder, map);
  });

  function geocodeAddress(geocoder, resultsMap) {
	  var address = document.getElementById('address').value;

	  geocoder.geocode({'address': address}, function(results, status) {
	    if (status === 'OK') {
	      resultsMap.setCenter(results[0].geometry.location);
	      var marker = new google.maps.Marker({
	        map: resultsMap,
	        position: results[0].geometry.location
	      });
	      document.getElementById('latitude').value = results[0].geometry.location.lat();
	      document.getElementById('longitude').value = results[0].geometry.location.lng();
	    } else {
	      alert('Geocode was not successful for the following reason: ' + status);
	    }
	  });
	}
});
