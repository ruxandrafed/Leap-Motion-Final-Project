function translink (lat, lng) {

  $.getJSON("/translink/stops", {lat: lat, lng: lng}, renderTranslinkMarkers)

};

// var prev_infoWindow;

var translinkMarkers = [];


function renderTranslinkMarkers (data) {
  stops = data.Stops.Stop;

  stops.map(function (stop) {
    name = stop.Name;
    route = stop.Routes;
    atStreet = stop.AtStreet[0];
    stopNo = stop.StopNo;

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
        iwBackground.children(':nth-child(4)').css({'background' : 'rgba(240, 240, 240, 0.6)', 'border-radius' : '5px'});
      });

      google.maps.event.trigger(markerTr, 'click')

    });

  });
}

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

function getTranslinkBusRoutesInfo(route) {

  $.ajax({
    method: 'get',
    url: '/translink/routes' ,
    data: {route: route},
    success: renderBusRouteInfoMarker
  });

}

function renderBusRouteInfoMarker(details) {
  var routeDetails = JSON.parse(details);
  var routeName = routeDetails.Route.Name[0];
  var routeNumber = routeDetails.Route.RouteNo[0];
  $('#bus-route-info-box').show();
  $('#bus-route-info-box').text("Bus #" + routeNumber + ": " + routeName);
}

