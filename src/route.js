module.exports = function(pureRoute) {
  if(!pureRoute) throw Error('Please provide a route function to wrap');

  return function(req, res, next) {
    var pureRes = pureRoute(req);

    if(pureRes.statusCode) res.status(pureRes.statusCode);
    if(pureRes.body) res.send(pureRes.body);
    if(pureRes.headers) {
      for(var k in pureRes.headers){
        res.header(k, pureRes.headers[k]);
      }
    }
    return next();
  };
};
