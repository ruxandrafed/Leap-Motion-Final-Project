var Hapi = require('hapi');
var Path = require('path');

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

  // Start the server
  server.start(function (err) {
    if (err) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });

});




