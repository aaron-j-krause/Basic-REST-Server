exports = module.exports = {};

exports.route = function(req, res, handlers, path) {
  handlers[path.pathname][req.method](req, res, path);

};
