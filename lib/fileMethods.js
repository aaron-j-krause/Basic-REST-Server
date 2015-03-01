exports = module.exports = {};

var fs = require('fs');
var Q = require('q');
var qs = require('querystring');

var count = fs.readdirSync('./data').length + 1;
exports.success = function(data, res) {
  console.log('WIIIIIN: ' + data);
  res.writeHead(200, {'content-type':'application/json'});
  res.end(data);
};

exports.failure = function(err, res) {
  console.log('FAILLLL: ' + err);
  res.writeHead(404, {'content-type':'plain/text'});
  res.end(err);
};

exports.writeFile = function(info, path) {
  info = JSON.stringify(info);
  path = path || './data/' + count++ + '.json';
  var deferred = Q.defer();
  fs.writeFile(path, info, function(err) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(info);
    }
  });
  return deferred.promise;
};
