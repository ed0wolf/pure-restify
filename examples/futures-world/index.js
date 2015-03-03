var restify = require('restify'),
    pure = require('../../src/route.js'),
    Future = require('data.future');

var userStore = function(id) {
  return id === 'wsmith'
    ? Future.of({id: id, name: 'wsmith'}) 
    : Future.rejected('id must be positive');
};

var respond = pure(function(req) {
  return userStore(req.params.id).map(function(user) { 
    return { body: user };
  });
});

var server = restify.createServer();
server.get('/user/:id', respond);

server.listen(3000, function() {
  console.log('%s listening at %s', server.name, server.url);
});
