var curry = require('lodash.curry');

var handlePureResult = curry(function(res, pr) {
  if(pr.headers) {
    for(var k in pr.headers){
      res.header(k, pr.headers[k]);
    }
  }

  return pr.statusCode 
    ? res.send(pr.statusCode, pr.body)
    : res.send(pr.body);
});

module.exports = function(pureRoute) {
  if(!pureRoute) throw Error('Please provide a route function to wrap');

  return function(req, res, next) {
    var pureRes = pureRoute(req);
    
    if(pureRes.fork) {
      pureRes.fork(handlePureResult.bind(this, res, {statusCode: 500}), handlePureResult(res));
    } else {
      handlePureResult(res, pureRes);
    }
    next();
  };
};

