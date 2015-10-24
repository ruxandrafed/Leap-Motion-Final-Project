function generateHyperlapse(origin, destination) {

  var hyperlapseDivWidth = $("div#hyperlapse").width() - 5;

  var hyperlapse = new Hyperlapse(document.getElementById('hyperlapse'), {
    lookat: origin,
    zoom: 1,
    use_lookat: true,
    elevation: 50,
    width: hyperlapseDivWidth,
    heigh: hyperlapseDivWidth/2
  });

  hyperlapse.onError = function(e) {
    console.log(e);
  };

  hyperlapse.onRouteComplete = function(e) {
    hyperlapse.load();
  };

  hyperlapse.onLoadComplete = function(e) {
    hyperlapse.play();
  $('#hyperlapse-loading').hide();
  };

  // Google Maps API stuff here...
  var directions_service = new google.maps.DirectionsService();

  var route = {
    request:{
      origin: origin,
      destination: destination,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    }
  };

  directions_service.route(route.request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      hyperlapse.generate( {route:response} );
    } else {
      console.log(status);
    }
  });

}
