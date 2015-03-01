exports = module.exports = {};

var http = require('http');
var url = require('url');

exports.startServer = function(handlers, route) {
  function onReq(req, res) {
    var path = url.parse(req.url);
    var split = path.pathname.split('/');
    path.pathname = '/' + split[1];
    path.params = split[2];
    req.filePath = './data/' + path.params + '.json';
    req.on('data', function(data){
      req.body = data;
    });
    route(req, res, handlers, path);

  }
  http.createServer(onReq).listen(3000);
};
