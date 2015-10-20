function translink (lat, lng, map) {

  busMarkerInfo = [];

  $.getJSON("/translink", {lat: lat, lng: lng}, function (data) {
    stops = data.Stops.Stop;
    stops.forEach(function (stop) {
      contentString = '<div class="infoWindowContent"> <p> At Street:' + stop.AtStreet[0] + '</p>'
        + '<p> Name: ' + stop.Name[0] + '</p>'
        + '<p>Routes: ' + stop.Routes[0] + '</p></div>'
      busMarkerInfo.push([stop.Latitude[0], stop.Longitude[0], stop.AtStreet[0], stop.Name[0], stop.Routes[0], contentString])
    });
    renderMarkers(busMarkerInfo, map);
  });
};

function renderMarkers (array, map) {
  array.forEach(function (busStop) {
    busIcon = "https://maps.gstatic.com/mapfiles/ms2/micons/bus.png"
    var marker = new google.maps.Marker({
      position: {lat: parseFloat(busStop[0]), lng: parseFloat(busStop[1])},
      map: map,
      icon: busIcon,
      title: busStop[3]
    })

    var infoWindow = new google.maps.InfoWindow({
      content: busStop[5]
    })

    var prev_infoWindow;

    marker.addListener('click', function() {
      if (prev_infoWindow) {
        prev_infoWindow.close();
      };
      infoWindow.open(map.getStreetView(), marker);
      prev_infoWindow = infoWindow;
    });

  });

}
