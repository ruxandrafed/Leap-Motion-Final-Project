var prev_infoWindowM = false;
var prev_infoWindowSV = false;

function createMarker(place, map) {

  var lat=place.geometry.location.lat();
  var lng=place.geometry.location.lng();
  var icon_to_use;
  // console.log(place);

  var image = {
    size: new google.maps.Size(40, 64),
  }
  var busMarkerImage = "https://maps.gstatic.com/mapfiles/ms2/micons/bus.png"

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
