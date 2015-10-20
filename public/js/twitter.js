function getTweets(lat, lng, map) {

  var allTweets = [];

  $.ajax({
    method: 'get',
    url: '/tweets' ,
    data: {geocode: lat + ',' + lng + ',0.1km'},
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

function renderTwitterMarkers (array, map) {
  array.forEach(function (tweet) {
    tweetIcon = "http://epsos.de/files/transparent-twitter-icon-logo.png";
    var marker = new google.maps.Marker({
      position: {lat: tweet[0], lng: tweet[1]},
      map: map,
      icon: tweetIcon,
      title: tweet[2]
    });

    var infoWindow = new google.maps.InfoWindow({
      content: '<div class="infoWindowContent"> <p>' + tweet[3] + '</p>'
        + '<img src="' + tweet[5] + '">'
        + '<p> Posted by: <a href="http://www.twitter.com/' + tweet[4] + '">' + tweet[4] + '</a></p>'
        + '<p> On: ' + tweet[2] + '</p></div>'
    })

    marker.addListener('click', function() {
      if (prev_infoWindow) {
        prev_infoWindow.close();
      };
      infoWindow.open(map.getStreetView(), marker);
      prev_infoWindow = infoWindow;
    });

  });

}
