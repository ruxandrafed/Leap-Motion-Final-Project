var panorama;
var vancouver = {lat: 49.283324, lng: -123.119452};
// var place = place.geometry.location;


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
          radius: '100',
          types: ['store', 'restaurant', 'cafe', 'grocery_or_supermarket','bank', 'salon']
        };
        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map)
        service.search(request,callback)

        function callback(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              createMarker(results[i]);
            }
          } 
        }
        // var customIcons = new google.maps.MarkerImage('images/icon.png') OR
        // var customIcons = {
          // url: 'images/beachflag.png'
          // size: new google.maps.Size(20, 32),
          // origin: new google.maps.Point(0,0),
        //}

        var image = {
          size: new google.maps.Size(20, 32),
        }

        var bankMarkerImage = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=dollar|FFFF00');

        var groceryMarkerImage = "https://maps.gstatic.com/mapfiles/ms2/micons/grocerystore.png";

        var salonMarkerImage = "https://maps.gstatic.com/mapfiles/ms2/micons/salon.png";

        var restMarkerImage = "https://maps.gstatic.com/mapfiles/ms2/micons/restaurant.png";

        var coffeeMarkerImage = "https://maps.gstatic.com/mapfiles/ms2/micons/coffeehouse.png";

        var storeMarkerImage = "https://maps.gstatic.com/mapfiles/ms2/micons/shopping.png"

        var pharmacyMarkerImage = "https://maps.gstatic.com/mapfiles/ms2/micons/hospitals.png"
  
          function createMarker(place) {     
            var markpos = place.geometry.location;
            var marker;
            var icon_to_use;

            if (place.types.indexOf('salon') != -1) {
              icon_to_use = salonMarkerImage;
            } if (place.types.indexOf('bank') != -1) { icon_to_use = bankMarkerImage;
            } if (place.types.indexOf('grocery_or_supermarket') != -1) {
              icon_to_use = groceryMarkerImage;
            } if (place.types.indexOf('restaurant') != -1) {
              icon_to_use = groceryMarkerImage;
            } if (place.types.indexOf('cafe') != -1) {
              icon_to_use = coffeeMarkerImage;
            } if (place.types.indexOf('pharmacy') != -1) {
              icon_to_use = pharmacyMarkerImage;
            } if (place.types.indexOf('store') != -1) {
              icon_to_use = storeMarkerImage;
            }

            marker = new google.maps.Marker({
              map: map,
              position: markpos,
              icon: icon_to_use 
            });
            
          
            google.maps.event.addListener(marker, 'click', function() {
              infowindow.setContent(place.name);
              infowindow.open(map, this);
            });
          }

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
  var lat = panorama.position.lat().toPrecision(7);
  var lng = panorama.position.lng().toPrecision(7);
  translink(lat,lng, map);
}
google.maps.event.addDomListener(window, 'load', initialize);

