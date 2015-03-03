var restify = require('restify'),
    pure = require('pure-restify');

var respond = pure(function(req) {
 return { body: 'hello ' + req.params.name };
});

var server = restify.createServer();
server.get('/hello/:name', respond);

server.listen(3000, function() {
  console.log('%s listening at %s', server.name, server.url);
});
