var restify = require('restify'),
    pure = require('../../src/route.js'),
    Future = require('data.future'),
    get = require('ramda').get,
    pointfree = require('pointfree-fantasy'),
    map = pointfree.map,
    compose = pointfree.compose;

var userStore = function(id) {
  return id === 'wsmith'
    ? Future.of({id: id, name: 'wsmith'})
    : Future.rejected('id must be positive');
};

var toBody = function(user) { return { body: user }; };
var respond = pure(compose(map(toBody), userStore, get('id'), get('params')));

var server = restify.createServer();
server.get('/user/:id', respond);

server.listen(3000, function() {
    console.log('%s listening at %s', server.name, server.url);
});

