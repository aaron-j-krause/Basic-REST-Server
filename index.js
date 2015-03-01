var server = require('./lib/server');
var requestHandler = require('./lib/requestHandler');
var router = require('./lib/router');

var handlers = {
  '/user':requestHandler.user
};

server.startServer(handlers, router.route);
