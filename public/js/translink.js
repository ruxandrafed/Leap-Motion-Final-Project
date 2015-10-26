function translink (lat, lng, map) {

  busMarkerInfo = [];

  $.getJSON("/translink/stops", {lat: lat, lng: lng}, renderTranslinkMarkers)
};

// var prev_infoWindow;

var translinkMarkers = [];


function renderTranslinkMarkers (data, map) {
  stops = data.Stops.Stop;
  stops.map(function (stop) {
    console.log(stop)
    name = stop.Name;
    route = stop.Routes;
    atStreet = stop.AtStreet[0];
    stopNo = stop.StopNo;
    function getContentRoutes(callback) {
    $.getJSON("/translink/buses", {stopNo: stopNo, count: 3, timeFrame: 90}, function (data) {
      var buses = data.NextBuses.NextBus;
      contentRoutes = '';
      buses.map(function (bus) {
        if (bus.Schedules[0].Schedule[2]) {
        contentRoutes = contentRoutes.concat('<span><b> #' + bus.RouteNo + '</b>: '
         + bus.Schedules[0].Schedule[0].ExpectedLeaveTime + ', '
         + bus.Schedules[0].Schedule[1].ExpectedLeaveTime + ', ' + bus.Schedules[0].Schedule[2].ExpectedLeaveTime
         + '</span><br></div>')
        } else {
          if (bus.Schedules[0].Schedule[1]){
            contentRoutes = contentRoutes.concat('<span><b> #' + bus.RouteNo + '</b>: '
             + bus.Schedules[0].Schedule[0].ExpectedLeaveTime + ', '
            + bus.Schedules[0].Schedule[1].ExpectedLeaveTime + '</span><br></div>')
          } else {
            contentRoutes = contentRoutes.concat('<span><b> #' + bus.RouteNo + '</b>: '
             + bus.Schedules[0].Schedule[0].ExpectedLeaveTime + '</span><br></div>')
          }
        }
      })
      callback(contentRoutes);
    });
  }


  getContentRoutes(function (contentRoutes) {
    // once we get here the ajax call is complete
    busIcon = "../images/places/busstop.png"

    var markerTr = new google.maps.Marker({

      position: {lat: parseFloat(stop.Latitude), lng: parseFloat(stop.Longitude)},
      map: panorama,
      icon: busIcon,
      title: atStreet
    })

    contentString = '<div class="infoWindowContent"> <div class="iw-title">Bus Stop No. ' + stopNo + ' </div>'
        + '<p>' + name + '</p>'
        + '<p> At Street: ' + atStreet + '</p>'
        // + '<p>Routes: ' + route + '</p>'
        + '<div class=><p>Next buses at:</p>'
        + contentRoutes + '</div>'

    translinkMarkers.push(markerTr);

    var infoWindow = new google.maps.InfoWindow({
      content: contentString,
      disableAutoPan: true
    })

    markerTr.addListener('click', function() {
      // if (prev_infoWindow) {
      //   prev_infoWindow.close();
      // };
      infoWindow.open(panorama, markerTr);
      // prev_infoWindow = infoWindow;

      var iwOuter = $('.gm-style-iw');
      var iwBackground = iwOuter.prev();
      iwBackground.children(':nth-child(4)').css({'background' : 'rgba(240, 240, 240, 0.9)', 'border-radius' : '5px'});
    });

    google.maps.event.trigger(markerTr, 'click')



  });


  });
}
