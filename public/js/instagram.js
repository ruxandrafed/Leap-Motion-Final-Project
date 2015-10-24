function getInstagramPosts(lat, lng, panorama) {

  $.ajax({
      type: "GET",
      dataType: "jsonp",
      cache: false,
      url: "https://api.instagram.com/v1/media/search?lat=" + lat + "&lng=" + lng + "&access_token=30927509.aff6da2.eee5673b0d90434cb82c7a37fdae4bc5&callback=data",
      success: function(data) {
        renderInstagramMarkers(data.data, map);
      }
  });

  }

var prev_infoWindow;
var instaMarkers = [];

function renderInstagramMarkers(array, map) {
  var instaIcon = "/images/instagram-logo.png";

  array.forEach(function (post) {

    var markerInsta = new google.maps.Marker({
      position: {lat: post.location.latitude, lng: post.location.longitude},
      map: panorama,
      icon: instaIcon,
      title: post.user.username
    });
    instaMarkers.push(markerInsta);

    var infoWindow = new google.maps.InfoWindow({
      content: '<div class="infoWindowContent"> <p>@' + post.user.username + '</p>'
        + '<img src="' + post.images.low_resolution.url + '" width="100px">'
        + '<p> Posted by: <a href="http://www.instagram.com/' + post.user.username + '">@' + post.user.username + '</a></p></div>'
    });

    markerInsta.addListener('click', function() {
      debugger;
      if (prev_infoWindow) {
        prev_infoWindow.close();
      };
      infoWindow.open(panorama, markerInsta);
      prev_infoWindow = infoWindow;
    });

  });

}
