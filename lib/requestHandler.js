exports = module.exports = {};

var fs = require('fs');
var Q = require('q');

function success(data, res){
  console.log('WIIIIIN: ' + data);
  res.writeHead(200, {'content-type':'plain/text'});
  res.end(data);
};

function failure(err, res){
  console.log('FAILLLL: ' + err);
  res.writeHead(404, {'content-type':'plain/text'})
  res.end(err);
}

function writeFile(info){
  var deferred = Q.defer();
  fs.writeFile('./data/test.json', JSON.stringify({'info':info}), function(err){
    if (err) {
      deferred.reject(err);   
    } else {
      deferred.resolve(info);
    }
  })
  return deferred.promise;
}

function readFile(){};

exports.user = function(req, res){

  var action = {
    'GET': function(req, res){
      console.log(req.method)
      writeFile('thing')
        .then(function(data) {
          success(data, res);
        }, function (err) {
          failure(err, res);
        });
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