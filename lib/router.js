exports = module.exports = {};

exports.route = function(req, res, handlers, path){
  handlers[path](req, res);

}