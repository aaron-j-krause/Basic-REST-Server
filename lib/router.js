exports = module.exports = {};

exports.route = function(req, res, handlers, path){
  handlers[path.pathname](req, res, path);

}