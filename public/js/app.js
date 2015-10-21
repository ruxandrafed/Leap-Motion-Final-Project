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
    $("#map").toggle().toggleClass('half-left');
    $("streetview").toggleClass('half-right');
    initialize();
  });

});
