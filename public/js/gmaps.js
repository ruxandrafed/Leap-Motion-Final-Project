var panorama;

var vancouver = {lat: 49.283324, lng: -123.119452};

function initialize() {

  // Basic Street View embed for homepage starts here

  panorama = new google.maps.StreetViewPanorama(
    document.getElementById('streetview'),
    {
      position: vancouver,
      addressControlOptions: {
        position: google.maps.ControlPosition.BOTTOM_CENTER
      },
      pov: {heading: 165, pitch: 0},
      zoom: 1
    });

}
