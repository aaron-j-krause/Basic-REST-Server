exports = module.exports = {};

var fs = require('fs');

var fileMethods = require('./fileMethods.js');

exports.user = {
    GET: function(req, res, url) {
      var info;
      fs.readdir('./data', function(err, files) {
        if (err) throw err;
        info = url.params ? fs.readFileSync('./data/' + url.params + '.json') :
         'The files available are: ' + files.join(', ').replace(/\.json/g, '')
        res.writeHead(200, {'Content-Type':'text/plain'});
        res.end(info);
      });
    },

    POST: function(req, res, url) {
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

    PATCH: function(req, res, url) {
      var json;
      var filePath;
      req.on('data', function(data) {
        json = JSON.parse(data);
      });
      req.on('end', function() {
        filePath = './data/' + url.params + '.json';
        fs.readFile(filePath, function(err, f) {
          file = JSON.parse(f);
          for (var i in json) {
            file[i] = json[i];
          }
          fileMethods.writeFile(file, filePath).then(function(data) {
            fileMethods.success(data, res);
          }, function(err) {
            fileMethods.failure(err, res);
          });
        });
      });
    },

    PUT: function(req, res, url) {
      var json;
      var filePath;
      req.on('data', function(data) {
        json = JSON.parse(data);
      });
      req.on('end', function() {
        filePath = './data/' + url.params + '.json';
        fileMethods.writeFile(json, filePath).then(function(data) {
          fileMethods.success(data, res);
        }, function(err) {
          fileMethods.failure(err, res);
        });
      });
    },

    DELETE: function(req, res, url) {
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
