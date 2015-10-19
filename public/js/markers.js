
var prev_infoWindowM = false;
var prev_infoWindowSV = false;

function requestInfoFromGoogle (map) {

  var request = {
    location: vancouver,
    radius: '100',
    types: ['store', 'restaurant', 'cafe', 'grocery_or_supermarket','bank', 'salon']
    // placeId: 'ChIJs0-pQ_FzhlQRi_OBm-qWkbs'
  };
  var service = new google.maps.places.PlacesService(map)
  service.search(request,getPlacesInfo)

  function getPlacesInfo(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i], map);
      };
    };
  };
}


function createMarker(place, map) {
  console.log(place);

  var lat=place.geometry.location.lat();
  var lng=place.geometry.location.lng();
  var icon_to_use;
  // console.log(place);


  var rating = hasRating(place);
  var name = place.name
  var placeType = place.types[0];

  placeType = capitalizeFirstLetter(placeType);

  var openNow = isOpen(place);
  var contentString = "<div class='infoWindowContent'> <p>Name: " + name + "</p>"
    + "<p>Rating: " + rating + "</p>"
    + "<p>Open: " + openNow + "</p>"
    + "<p>Type of Establishment: " + placeType + "</p></div>"


  var image = {
    size: new google.maps.Size(40, 64),
  }
  var busMarkerImage = "https://maps.gstatic.com/mapfiles/ms2/micons/bus.png"

  var bankMarkerImage = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=dollar|FFFF00');

  var groceryMarkerImage = "https://maps.gstatic.com/mapfiles/ms2/micons/grocerystore.png";

  var salonMarkerImage = "https://maps.gstatic.com/mapfiles/ms2/micons/salon.png";

  var restMarkerImage = "https://maps.gstatic.com/mapfiles/ms2/micons/restaurant.png";

  var coffeeMarkerImage = "https://maps.gstatic.com/mapfiles/ms2/micons/coffeehouse.png";

  var storeMarkerImage = "https://maps.gstatic.com/mapfiles/ms2/micons/shopping.png"

  var pharmacyMarkerImage = "https://maps.gstatic.com/mapfiles/ms2/micons/hospitals.png"

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
  } if (place.types.indexOf('bus_station') != -1) {
    icon_to_use = busMarkerImage;
  }

  var marker = new google.maps.Marker({
    map: map,
    position: {lat: lat, lng: lng},
    title: name,
    icon: icon_to_use
  });

  // Create infowindow for street view

  var infoWindowSV = new google.maps.InfoWindow({
    content: name
  });
  

  // Create infowindow for map view

  var infoWindowM = new google.maps.InfoWindow({
    content: name
  });

  marker.addListener('click', function() {

    if (prev_infoWindowM) {
      prev_infoWindowM.close();
    };
    if (prev_infoWindowSV) {
      prev_infoWindowSV.close();
    };
    infoWindowSV.open(map.getStreetView(), marker);
    infoWindowM.open(map, marker);
    prev_infoWindowM = infoWindowM;
    prev_infoWindowSV = infoWindowSV;
  });
}

function isOpen (place){
  if (place.opening_hours) {
    if (place.opening_hours.open_now) {
      return "Place is open."
    } else {
      return "Place is closed."
    };
   } else {
    return "Info not provided."
  }
};

function hasRating (place) {
  if (place.rating) {
    return place.rating
  } else {
    return "Has not been rated."
  }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}