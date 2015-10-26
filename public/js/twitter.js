var prev_infoWindow;
var twitterMarkers = [];

function getTweets(lat, lng, panorama) {
  twitterMarkers.forEach(function(marker)
  {
    marker.setMap(null);
  });

  $.ajax({
    method: 'get',
    url: '/tweets' ,
    data: {geocode: lat + ',' + lng + ',0.05km'},
    success: renderTwitterMarkers
  });
}

function withGeo(tweet) { return !!tweet.geo; }


function renderTwitterMarkers (array) {
  twitterMarkers = array.statuses.filter(withGeo)
  .map(function (tweet) {
    var tweetIcon = "/images/twitter-icon-logo.png";
    var markerTw = new google.maps.Marker({
      position:
      {
        lat: tweet.geo.coordinates[0],
        lng: tweet.geo.coordinates[1]
      },
      map: panorama,
      icon: tweetIcon,
      title: tweet.created_at
    });

    var infoWindow = new google.maps.InfoWindow({
      content: '<div class="infoWindowContent"><img class="twitter-user" src="' + tweet.user.profile_image_url + '"><div class="iw-title">@' + tweet.user.screen_name + ': </div><p>' + tweet.text + '</p>'
        + '<p> Posted by: <a href="http://www.twitter.com/' + tweet.user.screen_name + '">@' + tweet.user.screen_name + '</a></p>'
        + '<p> On: ' + tweet.created_at + '</p></div>',
      disableAutoPan: true
    });

    markerTw.addListener('click', function() {
      // if (prev_infoWindow) {
      //   prev_infoWindow.close();
      // };
      infoWindow.open(panorama, markerTw);
      // prev_infoWindow = infoWindow;
      var iwOuter = $('.gm-style-iw');
      var iwBackground = iwOuter.prev();
      iwBackground.children(':nth-child(4)').css({'background' : 'rgba(240, 240, 240, 0.9)', 'border-radius' : '5px'});
    });

    var iwOuter = $('.gm-style-iw');
      var iwBackground = iwOuter.prev();
      iwBackground.children(':nth-child(4)').css({'background' : 'rgba(240, 240, 240, 0.9)', 'border-radius' : '5px'});
    
    google.maps.event.trigger(markerTw, 'click')

    return markerTw;
  });

}
