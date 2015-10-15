var panorama;
var vancouver = {lat: 49.283324, lng: -123.119452};


function initialize() {

  // Basic Street View embed for homepage starts here

  // Set up the map
  var map = new google.maps.Map(document.getElementById('streetview'), {
    center: vancouver,
    zoom: 18,
    streetViewControl: false
  });

  // We get the map's default panorama and set up some defaults.\
  panorama = map.getStreetView();
  panorama.setPosition(vancouver);
  panorama.setPov(/** @type {google.maps.StreetViewPov} */({
    heading: 265,
    pitch: 0
  }));
  panorama.setOptions({
    'addressControlOptions': {
    'position': google.maps.ControlPosition.BOTTOM_CENTER
    }
  });

  panorama.setVisible(true);

  Leap.loop({enableGestures: true}, move);

};
