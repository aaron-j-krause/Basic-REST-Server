exports = module.exports = {};

var fs = require('fs');
var Q = require('q');
var qs = require('querystring');

var count = fs.readdirSync('./data').length;
function success(data, res){
  console.log('WIIIIIN: ' + data);
  res.writeHead(200, {'content-type':'application/json'});
  res.end(data);
};

function failure(err, res){
  console.log('FAILLLL: ' + err);
  res.writeHead(404, {'content-type':'plain/text'})
  res.end(err);
}

function writeFile(info, path){
  count++
  var info = JSON.stringify(info);
  var path = path || './data/' + count + '.json';
  var deferred = Q.defer();
  fs.writeFile(path, info, function(err){
    if (err) {
      deferred.reject(err);   
    } else {
      deferred.resolve(info);
    }
  })
  return deferred.promise;
}


exports.user = function(req, res, url){
  var action = {
    'GET': function(req, res, url){
      console.log(url.params);
      var info;
      fs.readdir('./data', function(err, files){
        if (err) throw err;
        console.log(files.length)
        info = 'The files available are: ' + files.join(', ').replace(/\.json/g, '');
        res.writeHead(200,{'Content-Type':'text/plain'})
        res.end(info);
      })
    },

    'POST': function(req, res, url){
      var json;
      req.on('data', function(data){
        json = JSON.parse(data)
      })
      req.on('end', function(){
        writeFile(json).then(function(data){
          success(data, res);
        }, function(err){
          failure(err, res);
        })
      })
    },

    'PATCH': function(req, res, url){
      var json, file, filePath;
      req.on('data', function(data){
        json = JSON.parse(data)
      })
      req.on('end', function(){
        filePath = './data/' + json.file + '.json';
        fs.readFile(filePath, function(err, f){
          file = JSON.parse(f);
          for(var i in json){
            if(i !== 'file') file[i] = json[i];
          }
          writeFile(file, filePath).then(function(data){
            success(data, res);
          }, function(err){
            failure(err, res);
          })
 
        })
      })
    },

    'PUT': function(req, res, url){
      var json, filePath;
      req.on('data', function(data){
        json = JSON.parse(data)
      })
      req.on('end', function(){
        filePath = './data/' + json.file + '.json';
        writeFile(json, filePath).then(function(data){
          success(data, res);
        }, function(err){
          failure(err, res);
        })
      })
    },

    'DELETE': function(req, res, url){
      var json, filePath;
      req.on('data', function(data){
        json = JSON.parse(data)
      });
      req.on('end', function(){
        filePath = './data/' + url.params + '.json';
        fs.unlink(filePath, function(){
          res.writeHead(200, {'content-type':'plain/text'});
          res.end('deleted');
        });
      });
    }
  }
  action[req.method](req, res, url);
}
