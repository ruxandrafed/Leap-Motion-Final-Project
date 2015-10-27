function getDirections(directionsDisplay, directionsService, map, origin, destination, selectedMode) {

  $("#clear-hyperlapse").hide();
  $("#directions-panel").show();
  $("#all-hyperlapse").show();
  $("#hyperlapse").show();

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

        $("#generate-hyperlapse").on("click", function(e) {
            $('#hyperlapse-loading').show();
            // $("#generate-hyperlapse").hide();
            generateHyperlapse(origin, destination); // generates hyperlapse
        });

      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

}
