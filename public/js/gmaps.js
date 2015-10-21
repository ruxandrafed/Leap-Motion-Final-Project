var panorama;
var vancouver = {lat: 49.283281, lng: -123.122786};


function initialize() {

  // Basic Street View embed for homepage starts here

  // Set up the map
  var leapActive = false;
  var map = new google.maps.Map(document.getElementById('streetview'), {
    center: vancouver,
    zoom: 18,
    streetViewControl: true
  });

  var service = new google.maps.places.PlacesService(map)


  // We get the map's default panorama and set up some defaults.
  panorama = map.getStreetView();
  panorama.setPosition(vancouver);
  panorama.setPov(/** @type {google.maps.StreetViewPov} */({
    heading: 265,
    pitch: 0
  }));
  panorama.setOptions({
    'addressControlOptions': {
    'position': google.maps.ControlPosition.BOTTOM_CENTER
    }
  });

  panorama.setVisible(true);

  // Event listeners when the map changes
  panorama.addListener('pano_changed', function() {
    lat = panorama.position.lat().toPrecision(7);
    lng = panorama.position.lng().toPrecision(7);
    
    if($('#add-places').is(":checked")) {
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

    if($('#add-tweets').is(":checked")) {
      getTweets(lat, lng, map);
    };

    if($('#add-translink').is(":checked")) {
    translink(lat, lng, map);
    };
    
  });


  map.addListener('center_changed', function() {
    var mapCenter = map.center;
    var request = {
      location: mapCenter,
      radius: '150',
      types: ['store', 'restaurant', 'cafe', 'grocery_or_supermarket','bank', 'salon']
    };
    service = new google.maps.places.PlacesService(map)
    service.search(request, getPlacesInfo);
    translink(lat, lng, map);
    getTweets(lat,lng, map);
  });


  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */(document.getElementById('location-address')),
    {types: ['geocode']});

  autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */(document.getElementById('location-address2')),
    {types: ['geocode']});

  var geocoder = new google.maps.Geocoder();

  // function to geocode an address and plot it on a map
  function changeMapCoordinates(address) {
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
         panorama.setPosition((results[0].geometry.location));      // center the map on address
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  // gets browser coordinates
  function geolocate() {
    // Try W3C Geolocation (Preferred)
    if(navigator.geolocation) {
      browserSupportFlag = true;
      navigator.geolocation.getCurrentPosition(function(position) {
        initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        panorama.setPosition(initialLocation);
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

  $("#map-address-btn").on("click", function(e) {
    if (!(leapActive)){
      loadLeap();
    };
    e.preventDefault();
    var address = $("#location-address").val() ;
    changeMapCoordinates(address);
    $('#myModal').modal('hide').fadeOut('slow');
    $('#myModalLocation').modal('hide').fadeOut('slow');
  })

  $("#citycentre-address-btn").on("click", function(e) {
    if (!(leapActive)){
      loadLeap();
    };
    e.preventDefault();
    panorama.setPosition(vancouver);
    $('#myModal').modal('hide').fadeOut('slow');
    $('#myModalLocation').modal('hide').fadeOut('slow');
  })

  $("#geolocate-address-btn").on("click", function(e) {
    geolocate();
    if (!(leapActive)){
      loadLeap();
    };
    $('#myModal').modal('hide').fadeOut('slow');
    $('#myModalLocation').modal('hide').fadeOut('slow');
  })

  $("#map-address-btn2").on("click", function(e) {
    if (!(leapActive)){
      loadLeap();
    };
    e.preventDefault();
    var address = $("#location-address2").val() ;
    changeMapCoordinates(address);
    $('#myModal').modal('hide').fadeOut('slow');
    $('#myModalLocation').modal('hide').fadeOut('slow');
  })

  $("#citycentre-address-btn2").on("click", function(e) {
    if (!(leapActive)){
      loadLeap();
    };
    e.preventDefault();
    panorama.setPosition(vancouver);
    $('#myModal').modal('hide').fadeOut('slow');
    $('#myModalLocation').modal('hide').fadeOut('slow');
  })

  $("#geolocate-address-btn2").on("click", function(e) {
    if (!(leapActive)){
      loadLeap();
    };
    geolocate();
    $('#myModal').modal('hide').fadeOut('slow');
    $('#myModalLocation').modal('hide').fadeOut('slow');
  })

  $("#myModal").on('hidden.bs.modal', function(e){
    if (!(leapActive)){
      loadLeap();
    };
    e.preventDefault();
  });

  // Checkboxes hiding markers

  function checkboxesListeners() {

    $('#add-places').change(function() {
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
        }
      } else {
          for (var i = 0; i < googlePlacesMarkers.length; i++) {
            googlePlacesMarkers[i].setMap(null);
          }
      };
    })

    $('#add-tweets').change(function() {
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

    $('#add-translink').change(function() {
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

  function getPlacesInfo(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createGPMarker(results[i], map);
      };
    };
  };

  // Loads Leap Motion controller

  function loadLeap() {
    leapActive==true;
    $('#leap-icon').addClass('leap-on');
    Leap.loop({enableGestures: true}, move);
  };
}





