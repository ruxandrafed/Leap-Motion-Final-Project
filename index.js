var Hapi = require('hapi');
var Path = require('path');
var request = require('request');

// Twitter Client

var Twitter = require('twitter');

var twitterClient = new Twitter({
  consumer_key: 'BgFf5snzuY1e6R8gZMs3XSYaU',
  consumer_secret: 'JmLfBsSzKei1a8a2EFM1TAPBL3e9BzcaK4Av9HO1LS5IlBQQMv',
  access_token_key: '3943153758-cp3OiK7PDOY0A35kzEWLKSFipLZsnd4G8JkvUsN',
  access_token_secret: 'HVyfpXki5q229RxdjHrvRU6Y94kDY0aGcH0hDHTfcZXEO'
});

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

// Initialize socket.io and attach it to the server listener
var io = require('socket.io')(server.listener);

io.on('connection', function (socket) {

  console.log('a user connected; socket id: ' + socket.id);

  socket.on('disconnect', function(){
    console.log('a user disconnected; socket id: ' + socket.id);
  });

});

// Adding inert - static file and directory handler for hapi
server.register(require('inert'), function (err) {

  if (err) {
    throw err;
  }

  // Add the route to main page
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply.file('index.html');
    }
  });

  // translink get method
  server.route({
    method: 'GET',
    path: '/translink',
    handler: function (req, reply) {
      var params = req.query;
      var request = require('request');
      var parseString = require('xml2js').parseString;
      var url = 'http://api.translink.ca/rttiapi/v1/stops?apikey=aGNpR72RV528weEJ7zZu&lat=' +
        params.lat + "&long=" + params.lng + "&radius=100"

      request(url, function (error, response, body) {
        var xml = body;
        parseString(xml, function (err, result){
          data = JSON.stringify(result)
          if (!error && response.statusCode == 200) {
            reply(data);
          }
        })
      });
    }
  })

  // Add public directory handler
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'public'
      }
    }
  });

  // Add the route to tweets page
  server.route({
    method: 'GET',
    path: '/tweets',
    handler: function (request, reply) {
      var params = request.query;
      twitterClient.get('search/tweets', params, function(error, tweets, response){
        if (!error) {
          // console.log(tweets);
          reply(tweets);
        }
      });
    }
  });

  // Start the server
  server.start(function (err) {
    if (err) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });

});

