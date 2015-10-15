$(function() {

  $("#modal-button").trigger("click");

  $("#menu-toggle").on("click", function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
  });

});
