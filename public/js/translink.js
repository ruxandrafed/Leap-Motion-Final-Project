function translink(lat,lng) {
  url = "http://api.translink.ca/rttiapi/v1/stops?apikey=aGNpR72RV528weEJ7zZu" +
  "&lat=" + lat + "&long=" + lng;
  $.getJSON(url, function(data) {
    console.log(data);
  });
};