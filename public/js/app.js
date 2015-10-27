$(function() {

  var socket = io();

  $("#modal-button").trigger("click");

  $("#menu-toggle").on("click", function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
    $('#menu-toggle span').toggleClass("glyphicon-chevron-right").toggleClass("glyphicon-chevron-left");
  });

  $("#drive-around").on("click", function(e) {
    e.preventDefault();
    $('#drive-around span').toggleClass("glyphicon-road").toggleClass("glyphicon-eye-open");
    $("#map").toggle().toggleClass('half-left');
    $("streetview").toggleClass('half-right');
    $("#get-directions-modal").toggle();
    $("#bus-routes-modal").toggle();
    $("#directions-panel").empty();
    $("#all-hyperlapse").hide();
    google.maps.event.trigger(panorama, "resize");
    google.maps.event.trigger(map, "resize");
  });

  $("#bus-routes-modal").on("click", function(e) {
    e.preventDefault();
    // Clears directions and hyperlapse divs
    $("#directions-panel").empty();
    $("#all-hyperlapse").hide();
  });

  $("#location-modal").on("click", function(e) {
    e.preventDefault();
    $("#directions-panel").empty();
    $("#all-hyperlapse").hide();
  })

});
