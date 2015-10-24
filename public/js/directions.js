function getDirections(directionsDisplay, directionsService, map, origin, destination, selectedMode) {

  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directions-panel'));

  calculateAndDisplayRoute(directionsService, directionsDisplay);

  function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode[selectedMode]
    }, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        $('#hyperlapse-loading').show();
        $('#canvas').remove(); // clears if a canvas already exists
        generateHyperlapse(origin, destination); // generates hyperlapse
        $('canvas:last').attr("id", "canvas")
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

}
