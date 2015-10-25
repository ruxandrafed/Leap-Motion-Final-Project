var prev_infoWindow = false;

var googlePlacesMarkers = [];

function createGPMarker(place, map) {

  var lat=place.geometry.location.lat();
  var lng=place.geometry.location.lng();

  var icon_to_use;
  var iconBase = "../images/places/";

  var rating = hasRating(place);
  var starRating = rateStar(rating);
  var name = place.name
  var placeType = place.types[0];


  placeType = removeUnderscore(placeType);
  placeType = capitalizeFirstLetter(placeType);

  var openNow = isOpen(place);

  var contentString = "<div class='infoWindowContent'> <div class='iw-title'>" + name + "</div><div class='contentBody'>"
    + "<p>Rating: " + rating + "<span class='stars'> " + starRating + "</span>" + "</p>"
    + "<p>Open: " + openNow + "</p>"
    + "<p>Type of Establishment: " + placeType + "</p></div></div>"
  // var image = {
  //   size: new google.maps.Size(42, 68),
  // };
  var bankMarkerImage = iconBase + 'bank.png'
  var groceryMarkerImage = iconBase + 'supermarket.png';
  var salonMarkerImage = iconBase + 'barber.png';
  var restMarkerImage = iconBase + 'fastfood.png';
  var coffeeMarkerImage = iconBase + 'coffee.png';
  var storeMarkerImage = iconBase + "mall.png";
  var pharmacyMarkerImage = iconBase + 'medicalstore.png';
  var barMarkerImage = iconBase + 'bar.png';
  var bakeMarkerImage = iconBase + 'bread.png';

  if (place.types.indexOf('salon') != -1) {
    icon_to_use = salonMarkerImage;
  } if (place.types.indexOf('bank') != -1) { icon_to_use = bankMarkerImage;
  } if (place.types.indexOf('grocery_or_supermarket') != -1) {
    icon_to_use = groceryMarkerImage;
  } if (place.types.indexOf('restaurant') != -1) {
    icon_to_use = restMarkerImage;
  } if (place.types.indexOf('cafe') != -1) {
    icon_to_use = coffeeMarkerImage;
  } if (place.types.indexOf('pharmacy') != -1) {
    icon_to_use = pharmacyMarkerImage;
  } if (place.types.indexOf('store') != -1) {
    icon_to_use = storeMarkerImage;
  }
  // if (place.types.indexOf('bus_station') != -1) {
  //   icon_to_use = busMarkerImage;
  // }
    if (place.types.indexOf('bar') != -1) {
    icon_to_use = barMarkerImage;
  } if (place.types.indexOf('bakery') != -1) {
    icon_to_use = bakeMarkerImage;
  }

  var markerP = new google.maps.Marker({
    map: panorama,
    position: {lat: lat, lng: lng},
    title: name,
    icon: icon_to_use,
  });
  googlePlacesMarkers.push(markerP);


  // Create infowindow for street view

  var infoWindow = new google.maps.InfoWindow({
    content: contentString
  });

  markerP.addListener('click', function() {
    // if (prev_infoWindow) {
    //   prev_infoWindow.close();
    // };
    infoWindow.open(map.getStreetView(), markerP);

    // prev_infoWindow = infoWindow;
    var iwOuter = $('.gm-style-iw');
    var iwBackground = iwOuter.prev();
    iwBackground.children(':nth-child(4)').css({'background' : 'rgba(240, 240, 240, 0.9)', 'border-radius' : '5px'});

  });

  // This open windows automatically, still buggy
  google.maps.event.trigger(markerP, 'click')

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

function rateStar (rating) {
  if (isNaN(rating)) return " ";
  var val = rating
  var size = Math.max(0, (Math.min(5, val))) * 16;
  var $span = $('<span />').width(size);
  return $span.prop('outerHTML');
}


function removeUnderscore(string) {
 return string.replace(/_/g, " ");
}

function capitalizeFirstLetter(string) {
   return string.charAt(0).toUpperCase() + string.slice(1);
}
