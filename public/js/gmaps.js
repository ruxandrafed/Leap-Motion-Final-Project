var panorama;
var vancouver = {lat: 49.283281, lng: -123.122786};


function initialize() {

  var leapActive = false;
  var placesCheckbox = $('#add-places');
  var tweetsCheckbox = $('#add-tweets');
  var translinkCheckbox = $('#add-translink');

  // Basic Street View embed for homepage starts here
  var map = new google.maps.Map(document.getElementById('map'), {
    center: vancouver,
    zoom: 18
  });

  panorama = new google.maps.StreetViewPanorama(
    document.getElementById('streetview'), {
      position: vancouver,
      pov: {
        heading: 265,
        pitch: 10
      }
  });

  panorama.setOptions({
    'addressControlOptions': {
    'position': google.maps.ControlPosition.BOTTOM_CENTER
    }
  });


  map.setStreetView(panorama);


  var service = new google.maps.places.PlacesService(map);
  var listOfMarkers = [];

  var directionsDisplay = new google.maps.DirectionsRenderer;
  var directionsService = new google.maps.DirectionsService;


  // Event listeners when the map changes
  panorama.addListener('pano_changed', function() {
    lat = panorama.position.lat().toPrecision(7);
    lng = panorama.position.lng().toPrecision(7);
    map.setCenter(panorama.position);

    if(placesCheckbox.is(":checked")) {
      var request = {
        location: panorama.location.latLng,
        radius: '50',
        types: ['bakery', 'bank', 'bar', 'book_store',
        'cafe', 'clothing_store', 'convenience_store', 'gas_station', 'shopping_mall',
        'library', 'liquor_store', 'movie_theatre', 'night_club', 'pharmacy', 'subway_station',
        'train_station', 'store', 'restaurant', 'grocery_or_supermarket', 'salon']
      };

      service.search(request, getPlacesInfo);
    };

    if(tweetsCheckbox.is(":checked")) {
      getTweets(lat, lng, map);
    };

    if(translinkCheckbox.is(":checked")) {
    translink(lat, lng, map);
    };

  });


  map.addListener('bounds_changed', function() {

    var mapCenter = map.center;

    if(placesCheckbox.is(":checked")) {
      var request = {
        location: panorama.location.latLng,
        radius: '50',
        types: ['bakery', 'bank', 'bar', 'book_store',
        'cafe', 'clothing_store', 'convenience_store', 'gas_station', 'shopping_mall',
        'library', 'liquor_store', 'movie_theatre', 'night_club', 'pharmacy', 'subway_station',
        'train_station', 'store', 'restaurant', 'grocery_or_supermarket', 'salon']
      };

      service.search(request, getPlacesInfo);
    };

    if(tweetsCheckbox.is(":checked")) {
      getTweets(lat, lng, map);
    };

    if(translinkCheckbox.is(":checked")) {
    translink(lat, lng, map);
    };

  });


  // Create the autocomplete object, restricting the search to geographical location types.
  autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */(document.getElementById('location-address')),
    {types: ['geocode']});

  autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */(document.getElementById('location-address2')),
    {types: ['geocode']});

  autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */(document.getElementById('location-address3')),
    {types: ['geocode']});

  var geocoder = new google.maps.Geocoder();

  // Function to geocode an address and plot it on a map
  function changeMapCoordinates(address) {
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {

         panorama.setPosition((results[0].geometry.location));      // center the map on address

         // Point streetview camera to a marker
         var heading = google.maps.geometry.spherical.computeHeading(panorama.location.latLng, results[0].geometry.location);
         var pov = panorama.getPov();
         pov.heading = heading;
         panorama.setPov(pov);

      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  // Gets browser coordinates
  function geolocate() {
    // Try W3C Geolocation (Preferred)
    if(navigator.geolocation) {
      browserSupportFlag = true;
      navigator.geolocation.getCurrentPosition(function(position) {
        initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        panorama.setPosition(initialLocation);

        // Point streetview camera to a marker
       var heading = google.maps.geometry.spherical.computeHeading(panorama.location.latLng, results[0].geometry.location);
       var pov = panorama.getPov();
       pov.heading = heading;
       panorama.setPov(pov);

      }, function() {
        handleNoGeolocation(browserSupportFlag);
      });
    }
    // Browser doesn't support Geolocation
    else {
      browserSupportFlag = false;
      handleNoGeolocation(browserSupportFlag);
    }

    function handleNoGeolocation(errorFlag) {
      if (errorFlag == true) {
        alert("Geolocation service failed.");
        initialLocation = vancouver;
      } else {
        alert("Your browser doesn't support geolocation. We've placed you in Vancouver's city centre.");
        initialLocation = vancouver;
      }
      panorama.setPosition(initialLocation);
    }
  }

  function hideModals() {
    $('#myModal').modal('hide').fadeOut('slow');
    $('#myModalLocation').modal('hide').fadeOut('slow');
    $('#myModalDirections').modal('hide').fadeOut('slow');
  }

  $("#map-address-btn").on("click", function(e) {
    if (!(leapActive)){
      loadLeap();
    };
    e.preventDefault();
    var address = $("#location-address").val() ;
    changeMapCoordinates(address);
    hideModals();
  })

  $("#citycentre-address-btn").on("click", function(e) {
    if (!(leapActive)){
      loadLeap();
    };
    e.preventDefault();
    panorama.setPosition(vancouver);
    hideModals();
  })

  $("#geolocate-address-btn").on("click", function(e) {
    geolocate();
    if (!(leapActive)){
      loadLeap();
    };
    hideModals();
  })

  $("#map-address-btn2").on("click", function(e) {
    if (!(leapActive)){
      loadLeap();
    };
    e.preventDefault();
    var address = $("#location-address2").val() ;
    changeMapCoordinates(address);
    hideModals();
  })

  $("#citycentre-address-btn2").on("click", function(e) {
    if (!(leapActive)){
      loadLeap();
    };
    e.preventDefault();
    panorama.setPosition(vancouver);
    hideModals();
  })

  $("#geolocate-address-btn2").on("click", function(e) {
    if (!(leapActive)){
      loadLeap();
    };
    geolocate();
    hideModals();
  })

  $("#map-address-btn3").on("click", function(e) {
    if (!(leapActive)){
      loadLeap(map);
    };
    e.preventDefault();
    var origin = panorama.position;
    var destination = $("#location-address3").val();
    var travelMode = $("#travel-mode").val();
    getDirections(directionsDisplay, directionsService, map, origin, destination, travelMode);
    hideModals();
  })

  $("#myModal").on('hidden.bs.modal', function(e){
    if (!(leapActive)){
      loadLeap();
    };
    e.preventDefault();
  });

  // Checkboxes hiding markers

  function checkboxesListeners() {

    placesCheckbox.change(function() {
      if($(this).is(":checked")) {
        var request = {
          location: panorama.location.latLng,
          radius: '50',
          types: ['bakery', 'bank', 'bar', 'book_store',
          'cafe', 'clothing_store', 'convenience_store', 'gas_station', 'shopping_mall',
          'library', 'liquor_store', 'movie_theatre', 'night_club', 'pharmacy', 'subway_station',
          'train_station', 'store', 'restaurant', 'grocery_or_supermarket', 'salon']
        };
        service = new google.maps.places.PlacesService(map);
        service.search(request, getPlacesInfo);
        for (var i = 0; i < googlePlacesMarkers.length; i++) {
          googlePlacesMarkers[i].setMap(map);
          setTimeout(function() {google.maps.event.trigger(googlePlacesMarkers[i], 'click')}, 500);
        }
      } else {
          for (var i = 0; i < googlePlacesMarkers.length; i++) {
            googlePlacesMarkers[i].setMap(null);
          }
      };
    })

    tweetsCheckbox.change(function() {
      if($(this).is(":checked")) {
        var lat = panorama.position.lat();
        var lng = panorama.position.lng();
        getTweets(lat, lng, map);
        for (var i = 0; i < twitterMarkers.length; i++) {
          twitterMarkers[i].setMap(map);
        }
      } else {
          for (var i = 0; i < twitterMarkers.length; i++) {
            twitterMarkers[i].setMap(null);
          }
      };
    })

    translinkCheckbox.change(function() {
      if($(this).is(":checked")) {
        var lat = panorama.position.lat().toPrecision(7);
        var lng = panorama.position.lng().toPrecision(7);
        translink(lat, lng, map);
        for (var i = 0; i < translinkMarkers.length; i++) {
          translinkMarkers[i].setMap(map);
        }
      } else {
          for (var i = 0; i < translinkMarkers.length; i++) {
            translinkMarkers[i].setMap(null);
          }
      };
    })
  }

  checkboxesListeners();

  var listOfMarkers= [];

  function includedInList(result) {
    return listOfMarkers.some(function (value) {
      return value.id === result.id;
    });
  }

 function getPlacesInfo(results, status) {
   if (status == google.maps.places.PlacesServiceStatus.OK) {
     results.filter(function (result) {
      return !includedInList(result);
     }).forEach(function (result) {
      listOfMarkers.push(result);
      createGPMarker(result, map);
     });
   };
 };

  // Loads Leap Motion controller

  function loadLeap(map) {
    leapActive==true;
    $('#leap-icon').addClass('leap-on');
    Leap.loop({enableGestures: true}, move);
  };
}





