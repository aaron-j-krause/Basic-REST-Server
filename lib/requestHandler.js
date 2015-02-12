exports = module.exports = {};

var fs = require('fs');
var Q = require('q');
var qs = require('querystring');
var url = require('url');

var count = 0
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
function readFile(info){
  var file, fileName;
  if(method === 'PUT' || method === 'PATCH'){
    fileName = info.file;
    file = fs.readFileSync('./data/' + info.file + '.json').toString();
    console.log(file);
  } else {
    fileName =  count++;
  }
}
function writeFile(info, path){
  console.log(path);
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

function readFile(){};

exports.user = function(req, res){
  var action = {
    'GET': function(req, res){
      var info;
      fs.readdir('./data', function(err, files){
        if (err) throw err;
        console.log(files.length)
        info = 'The files available are: ' + files.join(', ').replace(/\.json/g, '');
        res.writeHead(200,{'Content-Type':'text/plain'})
        res.end(info);
      })
    },

    'POST': function(req, res){
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

    'PUT': function(req, res){
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

    'PATCH': function(req, res){
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