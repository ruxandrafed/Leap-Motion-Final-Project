function translink(lat,lng, map) {
  preFilterTranslink();
  var url = "http://api.translink.ca/rttiapi/v1/stops?apikey=aGNpR72RV528weEJ7zZu" +
  "&lat=" + lat + "&long=" + lng + "&radius=100";
  busMarkerInfo = [];
  getBusInfo(url, map);
  
};

function getBusInfo (url, map) {

  // $.getJSON(tripUpdate, function (buses) {
  //   console.log(buses);
  // })
  console.log(url)
  $.getJSON(url, function (stops) {
    console.log(url)
    console.log(stops);
    stops.forEach(function (stop) {
      contentString = '<div class="infoWindowContent"> <p> At Street:' + stop.AtStreet + '</p>'
        + '<p> Name: ' + stop.Name + '</p>'
        + '<p>Routes: ' + stop.Routes + '</p></div>'
      busMarkerInfo.push([stop.Latitude, stop.Longitude, stop.AtStreet, stop.Name, stop.Routes, contentString])
    });
    renderMarkers(busMarkerInfo, map);
  });
}

function renderMarkers (array, map) {
  array.forEach(function (busStop) {
    busIcon = "https://maps.gstatic.com/mapfiles/ms2/micons/bus.png"
    var marker = new google.maps.Marker({
      position: {lat: busStop[0], lng: busStop[1]},
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

function preFilterTranslink () {
  $.ajaxPrefilter(function (options) {
    if (options.crossDomain && jQuery.support.cors) {
       options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
  });
}
