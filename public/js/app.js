$(function() {

  var socket = io();

  $("#modal-button").trigger("click");

  $("#menu-toggle").on("click", function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
    $('#menu-toggle span').toggleClass("glyphicon-chevron-right").toggleClass("glyphicon-chevron-left");
  });

  $("#map-address-btn").on("click", function(e){
    e.preventDefault();
    var address = $("#location-address").val();         // grab the address from the input field
    codeAddress(address);                   // geocode the address
  });

});
