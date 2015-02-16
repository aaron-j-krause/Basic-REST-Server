exports = module.exports = {};

var fs = require('fs');

var fileMethods = require('./fileMethods.js');


exports.user = {
    GET: function(req, res, url) {
      var info;
      fs.readdir('./data', function(err, files) {
        if (err) throw err;
        info = url.params ? fs.readFileSync('./data/' + url.params + '.json') :
         'The files available are: ' + files.join(', ').replace(/\.json/g, '');
        res.writeHead(200, {'Content-Type':'text/plain'});
        res.end(info);
      });
    },

    POST: function(req, res, url) {
      req.on('end', function() {
        var json = JSON.parse(req.body);
        fileMethods.writeFile(json).then(function(data) {
          fileMethods.success(data, res);
        }, function(err) {
          fileMethods.failure(err, res);
        });
      });
    },

    PATCH: function(req, res, url) {
      req.on('end', function() {
        var json = JSON.parse(req.body);
        fs.readFile(req.filePath, function(err, f) {
          file = JSON.parse(f);
          for (var i in json) {
            file[i] = json[i];
          }
          fileMethods.writeFile(file, req.filePath).then(function(data) {
            fileMethods.success(data, res);
          }, function(err) {
            fileMethods.failure(err, res);
          });
        });
      });
    },

    PUT: function(req, res, url) {
      req.on('end', function() {
        var json = JSON.parse(req.body);
        fileMethods.writeFile(json, req.filePath).then(function(data) {
          fileMethods.success(data, res);
        }, function(err) {
          fileMethods.failure(err, res);
        });
      });
    },

    DELETE: function(req, res, url) {
      req.on('end', function() {
        fs.unlink(req.filePath, function() {
          res.writeHead(200, {'content-type':'text/plain'});
          res.end('deleted');
        });
      });
    }
};
