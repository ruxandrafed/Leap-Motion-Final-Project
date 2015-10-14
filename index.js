var Hapi = require('hapi');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});

// Add the route
server.route({
    method: 'GET',
    path:'/', 
    handler: function (request, reply) {
        reply('<h2>hello Rux and Mary!</h2>' +
          '<h3> Jason is awesome</h3>');
    }
});

// Start the server
server.start(function () {
    console.log('Server running at:', server.info.uri);
});