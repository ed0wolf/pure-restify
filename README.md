# Pure Restify

Allows you to turn any restify endpoints into pure functions. 

Instead of calling function on the mutable response object like:
```javascript
var respond = function (req, res, next) {
  res.send("hello, "+req.params.name);
  next();
};
```
Pure restify allows you to make this a pure function
```javascript
var respond = pure(function(req) {
  return { body: "hello, "+req.params.name };
});
```

By wrapping this function in pure, we can simply return what we wish to respond. Pure Restify handles the res.send and next calls for us.

Another nice thing about pure is that it also handles responses returned in futures (https://www.npmjs.com/package/data.future). Meaning your function can return it a future of the response you want to return and it will fork it and handle the response for you.

```javascript
var respond = pure(function(req) {
  return Future.of({ body: "hello, "+req.params.name });
});
```

Now I know that last example was a pointless one but it just shows that pure will extract the body from the future.

Checkout the examples for more.
