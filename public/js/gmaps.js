var panorama;
var vancouver = {lat: 49.283324, lng: -123.119452};


function initialize() {

  // Basic Street View embed for homepage starts here

  // Set up the map
  var leapActive = false;
  var map = new google.maps.Map(document.getElementById('streetview'), {
    center: vancouver,
    zoom: 18,
    streetViewControl: true
  });

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

  var request = {
          location: vancouver,
          radius: '500',
          types: ['store']
        };

  // Create the PlaceService and send the request.
  // Handle the callback with an anonymous function.
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, function(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        // If the request succeeds, draw the place location on
        // the map as a marker, and register an event to handle a
        // click on the marker.
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });
      }
    }
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

  function loadLeap() {
    leapActive==true;
    $('#leap-icon').addClass('leap-on');
    Leap.loop({enableGestures: true}, move);
  };
}
google.maps.event.addDomListener(window, 'load', initialize);
