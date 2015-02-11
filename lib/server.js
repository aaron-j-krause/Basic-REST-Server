exports = module.exports = {};

var http = require('http');
var url = require('url');

exports.startServer = function(handlers, route){
  function onReq(req, res){
    var path = url.parse(req.url).pathname

    route(req, res, handlers, path);

  }
  http.createServer(onReq).listen(3000);
}