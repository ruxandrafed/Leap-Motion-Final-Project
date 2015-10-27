var panorama;
var vancouver = {lat: 49.283281, lng: -123.122786};



function initialize() {

  var leapActive = false;
  var placesCheckbox = $('#add-places');
  var tweetsCheckbox = $('#add-tweets');
  var translinkCheckbox = $('#add-translink');
  var instagramCheckbox = $('#add-instagram');

  // Basic Street View embed for homepage starts here
  var map = new google.maps.Map(document.getElementById('map'), {
    center: vancouver,
    mapTypeControl: false,
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
    },
  });

  // Making a fake infowindow to force applying styling on start
  var infoWindow = new google.maps.InfoWindow({
    content: '',
    disableAutoPan: true
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
      clearOverlays(googlePlacesMarkers);
      googlePlacesMarkers = [];
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
      clearOverlays(twitterMarkers);
      twitterMarkers = [];
      getTweets(lat, lng, panorama);
    };

    if(translinkCheckbox.is(":checked")) {
      clearOverlays(translinkMarkers);
      translinkMarkers = [];
      translink(lat, lng, panorama);
    };

    if(instagramCheckbox.is(":checked")) {
      clearOverlays(instaMarkers);
      instaMarkers = [];
      getInstagramPosts(lat, lng, panorama);
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

          // Resets map
          var currentCenter = panorama.getPosition();
          var map = new google.maps.Map(document.getElementById('map'), {
            center: currentCenter,
            mapTypeControl: false,
            zoom: 18
          });
          map.setStreetView(panorama);

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

        // Resets map
        var map = new google.maps.Map(document.getElementById('map'), {
          center: initialLocation,
          mapTypeControl: false,
          zoom: 18
        });
        map.setStreetView(panorama);

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

  // Welcome modal stuff
  function hideModals() {
    $('#myModal').modal('hide').fadeOut('slow');
    $('#myModalLocation').modal('hide').fadeOut('slow');
    $('#myModalDirections').modal('hide').fadeOut('slow');
    $('#myModalBusRoutes').modal('hide').fadeOut('slow');
  }

  $("#map-address-btn").on("click", function(e) {
    if (!(leapActive)){
      var my_controller = loadLeap();
    };
    e.preventDefault();
    var address = $("#location-address").val() ;
    changeMapCoordinates(address);
    hideModals();
  })

  $("#citycentre-address-btn").on("click", function(e) {
    if (!(leapActive)){
      var my_controller = loadLeap();
    };
    e.preventDefault();
    panorama.setPosition(vancouver);
    hideModals();
  })

  $("#geolocate-address-btn").on("click", function(e) {
    geolocate();
    if (!(leapActive)){
      var my_controller = loadLeap();
    };
    hideModals();
  })

  $("#map-address-btn2").on("click", function(e) {
    if (!(leapActive)){
      var my_controller = loadLeap();
    };
    e.preventDefault();
    var address = $("#location-address2").val() ;
    changeMapCoordinates(address);
    hideModals();
  })

  $("#citycentre-address-btn2").on("click", function(e) {
    if (!(leapActive)){
      var my_controller = loadLeap();
    };
    e.preventDefault();
    panorama.setPosition(vancouver);
    hideModals();

    // Resets map
    var currentCenter = panorama.getPosition();
    var map = new google.maps.Map(document.getElementById('map'), {
      center: currentCenter,
      mapTypeControl: false,
      zoom: 18
    });
    map.setStreetView(panorama);

  })

  $("#geolocate-address-btn2").on("click", function(e) {
    if (!(leapActive)){
      var my_controller = loadLeap();
    };
    geolocate();
    hideModals();
  })

  $("#map-address-btn3").on("click", function(e) {
    if (!(leapActive)){
      var my_controller = loadLeap();
    };
    e.preventDefault();
    $('#hyperlapse').empty();
    $("#generate-hyperlapse").show();
    var origin = panorama.position;
    var destination = $("#location-address3").val();
    var travelMode = $("#travel-mode").val();

    // Clears map if any bus routes exist on it
    var currentCenter = panorama.getPosition();
    var map = new google.maps.Map(document.getElementById('map'), {
      center: currentCenter,
      mapTypeControl: false,
      zoom: 18
    });

    getDirections(directionsDisplay, directionsService, map, origin, destination, travelMode);
    hideModals();
  })

  $("#myModal").on('hidden.bs.modal', function(e){
    if (!(leapActive)){
      var my_controller = loadLeap();
    };
    e.preventDefault();
  });

    $("#myModalHelp").on('hidden.bs.modal', function(e){
    helpOpen = false;
    e.preventDefault();
  });

  $("#simulate-bus-routes").on("click", function(e) {
    if (!(leapActive)){
      var my_controller = loadLeap();
    };
    e.preventDefault();
    hideModals();
    var route = $("#select-bus-routes").val();
    addBusRoutesLayers(route, map);
  });

  $("#clear-bus-routes").on("click", function(e) {
    if (!(leapActive)){
      var my_controller = loadLeap();
    };
    // Clears map if any bus routes exist on it
    var currentCenter = panorama.getPosition();
    var map = new google.maps.Map(document.getElementById('map'), {
      center: currentCenter,
      mapTypeControl: false,
      zoom: 18
    });
    map.setStreetView(panorama);
    hideModals();
  });

  $("#help-btn").on("click", function(e) {
    $(this).closest(".modal").one("hidden.bs.modal", function() {
      $("#myModalHelp").modal("show")
    }).modal("hide")
  });

  // Checkboxes hiding markers

  function checkboxesListeners() {

    placesCheckbox.change(function() {
      clearOverlays(googlePlacesMarkers)
      googlePlacesMarkers = [];
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
          googlePlacesMarkers[i].setMap(panorama);
          // setTimeout(function() {google.maps.event.trigger(googlePlacesMarkers[i], 'click')}, 500);
        }
      } else {
          for (var i = 0; i < googlePlacesMarkers.length; i++) {
            googlePlacesMarkers[i].setMap(null);
          }
      };
    });

    tweetsCheckbox.change(function() {
      clearOverlays(twitterMarkers);
      twitterMarkers = [];
      if($(this).is(":checked")) {
        var lat = panorama.position.lat();
        var lng = panorama.position.lng();
        getTweets(lat, lng, panorama);
        for (var i = 0; i < twitterMarkers.length; i++) {
          twitterMarkers[i].setMap(panorama);
        }
      } else {
          for (var i = 0; i < twitterMarkers.length; i++) {
            twitterMarkers[i].setMap(null);
          }
      };
    });

    instagramCheckbox.change(function() {
      clearOverlays(instaMarkers);
      instaMarkers = [];
      if($(this).is(":checked")) {
        var lat = panorama.position.lat();
        var lng = panorama.position.lng();
        getInstagramPosts(lat, lng, panorama);
        for (var i = 0; i < instaMarkers.length; i++) {
          instaMarkers[i].setMap(panorama);
        }
      } else {
          for (var i = 0; i < instaMarkers.length; i++) {
            instaMarkers[i].setMap(null);
          }
      };
    })

    translinkCheckbox.change(function() {
      clearOverlays(translinkMarkers);
      translinkMarkers = [];
      if($(this).is(":checked")) {
        var lat = panorama.position.lat().toPrecision(7);
        var lng = panorama.position.lng().toPrecision(7);
        translink(lat, lng, panorama);
        for (var i = 0; i < translinkMarkers.length; i++) {
          translinkMarkers[i].setMap(panorama);
        }
      } else {
          for (var i = 0; i < translinkMarkers.length; i++) {
            translinkMarkers[i].setMap(null);
          }
      };
    });
  }

  checkboxesListeners();

  var listOfMarkers= [];
  // Checks if GooglePlace marker exists already
  // function includedInList(result) {
  //   return listOfMarkers.some(function (value) {
  //     return value.id === result.id;
  //   });
  // }

 function getPlacesInfo(results, status) {
   if (status == google.maps.places.PlacesServiceStatus.OK) {
     results.map(function (result) {
      createGPMarker(result, map);
     });
   };
 }

  // Loads Leap Motion controller

  function loadLeap() {
    leapActive=true;
    // $('#leap-icon').addClass('leap-on');
    my_controller = new Leap.Controller({enableGestures: true});
    my_controller.on('frame', move)
    my_controller.connect();
    return my_controller
  };

  // Removes infowindows from panorama
  function clearOverlays(array) {
    if (array.length > 0) {
      for (var i = 0; i < array.length; i++) {
        array[i].setMap(null);
      }
    }
  }

  function addBusRoutesLayers(route, map) {
    $("#directions-panel").hide();
    $("#hyperlapse").hide();
    $("#hyperlapse-loading").hide();

    var currentCenter = map.getCenter();
    var map = new google.maps.Map(document.getElementById('map'), {
      center: currentCenter,
      mapTypeControl: false,
      zoom: 18
    });
    map.setStreetView(panorama);
    var ctaLayer = new google.maps.KmlLayer({
      url: 'http://nb.translink.ca/geodata/' + route + '.kmz',
      map: map,
      preserveViewport: true
    });
    google.maps.event.addListenerOnce(ctaLayer, 'defaultviewport_changed', function() {
      center = ctaLayer.getDefaultViewport().getCenter();
      map.panTo(center);
      map.fitBounds(ctaLayer.getDefaultViewport());
    });
  }

}



