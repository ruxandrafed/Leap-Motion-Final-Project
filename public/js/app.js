$(function() {

  var socket = io();

  $("#modal-button").trigger("click");

  $("#menu-toggle").on("click", function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
    $('#menu-toggle span').toggleClass("glyphicon-chevron-right").toggleClass("glyphicon-chevron-left");
    google.maps.event.trigger(map, 'resize');
    map.setZoom(map.getZoom());
  });

  $("#drive-around").on("click", function(e) {
    e.preventDefault();
    $('#drive-around span').toggleClass("glyphicon-road").toggleClass("glyphicon-eye-open");
    $("#map").toggle().toggleClass('half-left');
    $("streetview").toggleClass('half-right');
    $("#get-directions-modal").toggle()
    google.maps.event.trigger(panorama, "resize");
    google.maps.event.trigger(map, "resize");
  });

});
