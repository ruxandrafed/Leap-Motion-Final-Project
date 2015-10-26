function getTweets(lat, lng, panorama) {

  var allTweets = [];

  $.ajax({
    method: 'get',
    url: '/tweets' ,
    data: {geocode: lat + ',' + lng + ',0.05km'},
    success: function (tweets) {
      tweets.statuses.forEach(function(tweet) {
        if (tweet.geo) {
          allTweets.push([tweet.geo.coordinates[0], tweet.geo.coordinates[1], tweet.created_at, tweet.text, tweet.user.screen_name, tweet.user.profile_image_url]);
        };
        renderTwitterMarkers(allTweets, map);
      });
    }
  });

}

var prev_infoWindow;
var twitterMarkers = [];

function renderTwitterMarkers (array, map) {
  array.filter(function (tweet) {
    return !filterTwMarker(tweet);
    }).forEach(function (tweet) {
      var markerTw = createTwMarker(tweet);
      twitterMarkers.push(markerTw);
    });
}

function filterTwMarker(result) {
  if twitterMarkers.length > 0 {
  return twitterMarkers.some(function (value) {
    // Checks if a tweet with the exact timestamp exists
    return value.title === result[2];
  });
  }

}

function createTwMarker(tweet) {
  var tweetIcon = "/images/twitter-icon-logo.png";
  var markerTw = new google.maps.Marker({
    position: {lat: tweet[0], lng: tweet[1]},
    map: panorama,
    icon: tweetIcon,
    title: tweet[2]
  });
  // twitterMarkers.push(markerTw);

  var infoWindow = new google.maps.InfoWindow({
    content: '<div class="infoWindowContent"><img class="twitter-user" src="' + tweet[5] + '"><div class="iw-title">@' + tweet[4] + ': </div><p>' + tweet[3] + '</p>'
      + '<p> Posted by: <a href="http://www.twitter.com/' + tweet[4] + '">@' + tweet[4] + '</a></p>'
      + '<p> On: ' + tweet[2] + '</p></div>',
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

  google.maps.event.trigger(markerTw, 'click');
}
