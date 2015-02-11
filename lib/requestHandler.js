exports = module.exports = {};

var fs = require('fs');

exports.user = function(req, res){
  var action = {
    'GET': function(req, res){
      console.log(req.method)
      res.writeHead(200, {'content-type':'plain/text'});
      res.end('USERRR');
    },
    'POST': function(req, res){
      console.log(req.method)
      res.writeHead(200, {'content-type':'plain/text'});
      res.end('USERRR');
    },
    'PUT': function(req, res){
      console.log(req.method)
      res.writeHead(200, {'content-type':'plain/text'});
      res.end('USERRR');
    },
    'DELETE': function(req, res){
      console.log(req.method)
      res.writeHead(200, {'content-type':'plain/text'});
      res.end('USERRR');      
    }
  }
  action[req.method](req, res);
}