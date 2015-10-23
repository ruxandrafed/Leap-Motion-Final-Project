function translink (lat, lng, map) {

  busMarkerInfo = [];

  // $.getJSON ("/realtime"), function (data) {
  //   console.log(data);
  // };


  $.getJSON("/translink/stops", {lat: lat, lng: lng}, function (data) {
    stops = data.Stops.Stop;
    stops.forEach(function (stop) {
      busMarkerInfo.push([stop.Latitude[0], stop.Longitude[0], stop.AtStreet[0], stop.Name[0], stop.Routes[0], stop.StopNo[0]])
    });
    renderTranslinkMarkers(busMarkerInfo, map);
  });
};

var prev_infoWindow;

var translinkMarkers = [];


function renderTranslinkMarkers (array, map) {
  array.forEach(function (busStop) {
  name = busStop[3];
  route = busStop[4];
  atStreet = busStop[2];
  contentRoutes = ''
  // console.log("Whole object: ",busStop)
  // console.log("Stop No: ", busStop[5])
  function getContentRoutes() {
    $.getJSON("/translink/buses", {stopNo: busStop[5], count: 3, timeFrame: 90}, function (data) {
    // console.log("Next Buses, ", data.NextBuses.NextBus);
      var buses = data.NextBuses.NextBus;
      buses.forEach(function (bus) {
        // console.log(bus);
        contentRoutes = contentRoutes.concat('<p> Route No: ' + bus.RouteNo[0] + '</p>'
         + '<p> Next 3 buses: ' + bus.Schedules[0].Schedule[0].ExpectedLeaveTime + ', '
         + bus.Schedules[0].Schedule[1].ExpectedLeaveTime + ', ' + bus.Schedules[0].Schedule[2].ExpectedLeaveTime
         + '</p></div>')
      })
      console.log(contentRoutes)
      // return contentRoutes
    });
    returnContent(contentRoutes);

  }

  function returnContent(string) {
    $('.routes-content').text(string);
  }

  getContentRoutes();

    // busIcon = "https://maps.gstatic.com/mapfiles/ms2/micons/bus.png"
    busIcon = "../images/places/busstop.png"
    var markerTr = new google.maps.Marker({

      position: {lat: parseFloat(busStop[0]), lng: parseFloat(busStop[1])},
      map: panorama,
      icon: busIcon,
      title: busStop[3]
    })

    contentString = '<div class="infoWindowContent"> <p> At Street:' + atStreet + '</p>'
        + '<p> Name: ' + name + '</p>'
        + '<p>Routes: ' + route + '</p>'
        + '<p> StopNo ' + busStop[5] + '</p>'
        + '<div class=><h5>Bus Schedule Estimates</h5>'
        + '<span class="routes-content"></span>' + '</div>'
    translinkMarkers.push(markerTr);

    var infoWindow = new google.maps.InfoWindow({
      content: contentString
    })

    markerTr.addListener('click', function() {
      if (prev_infoWindow) {
        prev_infoWindow.close();
      };
      infoWindow.open(panorama, markerTr);
      prev_infoWindow = infoWindow;
    });

  });

}
