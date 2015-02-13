exports = module.exports = {};

var fs = require('fs');

var fileMethods = require('./fileMethods.js');

exports.user = function(req, res, url) {
  var action = {
    'GET': function(req, res, url) {
      var info;
      fs.readdir('./data', function(err, files) {
        if (err) throw err;
        info = 'The files available are: ' + files.join(', ').replace(/\.json/g, '');
        res.writeHead(200, {'Content-Type':'text/plain'});
        res.end(info);
      });
    },

    'POST': function(req, res, url) {
      var json;
      req.on('data', function(data) {
        json = JSON.parse(data);
      });
      req.on('end', function() {
        fileMethods.writeFile(json).then(function(data) {
          fileMethods.success(data, res);
        }, function(err) {
          fileMethods.failure(err, res);
        });
      });
    },

    'PATCH': function(req, res, url) {
      var json;
      var file;
      var filePath;
      req.on('data', function(data) {
        json = JSON.parse(data);
      });
      req.on('end', function() {
        filePath = './data/' + json.file + '.json';
        fs.readFile(filePath, function(err, f) {
          file = JSON.parse(f);
          for (var i in json) {
            if (i !== 'file') file[i] = json[i];
          }
          fileMethods.writeFile(file, filePath).then(function(data) {
            fileMethods.success(data, res);
          }, function(err) {
            fileMethods.failure(err, res);
          });
        });
      });
    },

    'PUT': function(req, res, url) {
      var json;
      var filePath;
      req.on('data', function(data) {
        json = JSON.parse(data);
      });
      req.on('end', function() {
        filePath = './data/' + json.file + '.json';
        fileMethods.writeFile(json, filePath).then(function(data) {
          fileMethods.success(data, res);
        }, function(err) {
          fileMethods.failure(err, res);
        });
      });
    },

    'DELETE': function(req, res, url) {
      var json;
      var filePath;
      req.on('data', function(data) {
        json = JSON.parse(data);
      });
      req.on('end', function() {
        filePath = './data/' + url.params + '.json';
        fs.unlink(filePath, function() {
          res.writeHead(200, {'content-type':'plain/text'});
          res.end('deleted');
        });
      });
    }
  };
  action[req.method](req, res, url);
};
