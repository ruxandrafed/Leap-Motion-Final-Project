
function createMarker(place, map) {

  var lat=place.geometry.location.lat();
  var lng=place.geometry.location.lng();
  var icon_to_use;
  console.log(place);

  var image = {
    size: new google.maps.Size(20, 32),
  }

  var name = place.name

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
  }

  var marker = new google.maps.Marker({
    map: map,
    position: {lat: lat, lng: lng},
    title: name,
    icon: icon_to_use
  });
  
  var infoWindow = new google.maps.InfoWindow({
    content: name
  });

  var prev_infoWindow;

  marker.addListener('click', function() {
    if (prev_infoWindow) {
      prev_infoWindow.close();
    };
    infoWindow.open(map.getStreetView(), marker);
    prev_infoWindow = infoWindow;
    // return prev_infoWindow
  });
}
