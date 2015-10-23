function translink (lat, lng, map) {

  busMarkerInfo = [];

  // $.getJSON ("/realtime"), function (data) {
  //   // console.log(data);
  // };

  $.getJSON("/translink", {lat: lat, lng: lng}, function (data) {
    stops = data.Stops.Stop;
    stops.forEach(function (stop) {
      contentString = '<div class="infoWindowContent"> <p> At Street:' + stop.AtStreet[0] + '</p>'
        + '<p> Name: ' + stop.Name[0] + '</p>'
        + '<p>Routes: ' + stop.Routes[0] + '</p></div>'
      busMarkerInfo.push([stop.Latitude[0], stop.Longitude[0], stop.AtStreet[0], stop.Name[0], stop.Routes[0], contentString])
    });
    renderTranslinkMarkers(busMarkerInfo, map);
  });
};

var prev_infoWindow;

var translinkMarkers = [];

function renderTranslinkMarkers (array, map) {
  array.forEach(function (busStop) {
    // busIcon = "https://maps.gstatic.com/mapfiles/ms2/micons/bus.png"
    busIcon = "../images/places/busstop.png"
    var markerTr = new google.maps.Marker({

      position: {lat: parseFloat(busStop[0]), lng: parseFloat(busStop[1])},
      map: panorama,
      icon: busIcon,
      title: busStop[3]
    })
    translinkMarkers.push(markerTr);

    var infoWindow = new google.maps.InfoWindow({
      content: busStop[5]
    })

    markerTr.addListener('click', function() {
      if (prev_infoWindow) {
        prev_infoWindow.close();
      };
      infoWindow.open(map.getStreetView(), markerTr);
      prev_infoWindow = infoWindow;
    });

  });

}



function retrieveBusRoute(route) {

  var busRoutes = {};

  $.getJSON("/translink-routes", function (data) {
    data.Buses.Bus.forEach(function(busRoute) {
      var busRouteName = busRoute.RouteNo[0];
      busRoutes[busRouteName] = [busRoute.Destination[0], busRoute.Direction[0], busRoute.RouteMap[0].Href[0]];
      // console.log(busRouteName + ': ' + busRoutes[busRouteName]);
    });
    // console.log(busRoutes);
    extractDestOrigin(route, busRoutes);
  });

  function extractDestOrigin(route, hash) {
    var kmzMap = hash[route][2];
    var data = {upload: kmzMap};
    debugger;

    $.post("http://ogre.adc4gis.com/convert", data, function (data) {
        console.log(data);
      });
    };

  }



retrieveBusRoute(250);
