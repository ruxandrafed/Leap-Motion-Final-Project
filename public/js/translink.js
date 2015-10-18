function translink(lat,lng, map) {
  url = "http://api.translink.ca/rttiapi/v1/stops?apikey=aGNpR72RV528weEJ7zZu" +
  "&lat=" + lat + "&long=" + lng + "&radius=100";
  busMarkerInfo = [];
  getBusInfo(url,map);
};

function getBusInfo (url, map) {
  $.getJSON(url, function (stops) {
    stops.forEach(function (stop) {
      contentString = '<div id ="content"> <p> At Street:' + stop.AtStreet + '</p>'
        + '<p> Name: ' + stop.Name + '</p>'
        + '<p>Routes: ' + stop.Routes + '</p></div>'
      busMarkerInfo.push([stop.Latitude, stop.Longitude, stop.AtStreet, stop.Name, stop.Routes, contentString])
    });
    renderMarkers(busMarkerInfo, map);
  });
}

function renderMarkers (array, map) {
  mapJ=map;

  array.forEach(function (busStop) {
    var marker = new google.maps.Marker({
      position: {lat: busStop[0], lng: busStop[1]},
      map: mapJ,
      title: busStop[3]
    })

    var infoWindow = new google.maps.InfoWindow({
      content: busStop[5]
    })

    var prev_infoWindow = false;

    marker.addListener('click', function() {
      if (prev_infoWindow) {
        prev_infoWindow.close();
      };
      infoWindow.open(mapJ.getStreetView(), marker);
      prev_infoWindow = infoWindow;
    });

  });

}



