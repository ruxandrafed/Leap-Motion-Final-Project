function getInstagramPosts(lat, lng) {

  var instaPosts = [];

  $.ajax({
      type: "GET",
      dataType: "jsonp",
      cache: false,
      url: "https://api.instagram.com/v1/media/search?lat=" + lat + "&lng=" + lng + "&access_token=30927509.aff6da2.eee5673b0d90434cb82c7a37fdae4bc5&callback=data",
      success: function(data) {
        renderInstagramMarkers(data.data);
      }
  });

  }

getInstagramPosts(41, -123);

function renderInstragramMarkers(array) {
  var instaPosts = [];
  array.forEach(post) {
    instaPosts.push([post.images.standard_resolution, post.user.username, post.user.profile_picture, post.link]);
  }
}
