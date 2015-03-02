var route = require('../src/route.js'),
    R = require('ramda'),
    should = require('chai').should(),
    sinon = require('sinon'),
    Future = require('data.future');

describe('when creating route with null', function() {
  it('should throw', function() {
    should.throw(function() { route(null); });
  });
});

describe('when pure route', function() {
  var req, res, next, wrappedRoute, outerRoute;
  beforeEach(function() {
    req = { isReq: true };
    res = {
      status: sinon.spy(),
      send: sinon.spy(),
      header: sinon.spy()
    };
    next = sinon.spy();
  });

  describe('does not return a body', function() {
    beforeEach(function() {
      outerRoute = route(function() {
        return {};
      });
      outerRoute(req, res, next);
    });

    it('should call send on response', function() {
      res.send.calledWith(undefined).should.be.true;
    });

    it('should call next', function() {
      next.calledOnce.should.be.true;
    });
  });

  describe('returns status code', function() {
    var statusCode = 418;
    beforeEach(function() {
      outerRoute = route(function() {
        return { statusCode: statusCode };
      });
      outerRoute(req, res, next);
    });

    it('should set status code on the response', function() {
      res.status.calledWith(statusCode).should.be.true;
    });

    it('should call next', function() {
      next.calledOnce.should.be.true;
    });
  });

  describe('returns body', function() {
    var body = { isBody: true };
    beforeEach(function() {
      outerRoute = route(function() {
        return { body: body };
      });
      outerRoute(req, res, next);
    });

    it('should send the body', function() {
      res.send.calledWith(body).should.be.true;
    });

    it('should call next', function() {
      next.calledOnce.should.be.true;
    });
  });

  describe('returns headers', function() {
    var headers;
    beforeEach(function() {
      headers = {
        accept: 'application/json',
        foo: 'bar'
      };
      outerRoute = route(function() {
        return { headers: headers };
      });
      outerRoute(req, res, next);
    });

    it('should set the headers', function() {
      res.header.calledWith('accept', 'application/json').should.be.true;   
      res.header.calledWith('foo', 'bar').should.be.true;   
    });

    it('should call next', function() {
      next.calledOnce.should.be.true;
    });
  });

  describe('takes in a parameter', function() {
    var injectedRequest;
    beforeEach(function() {
      outerRoute = route(function(inReq) {
        injectedRequest = inReq;
        return {};
      });
      outerRoute(req, res, next);
    });

    it('should inject the request into the wrapped route', function() {
      injectedRequest.should.equal(req);
    });
  });

  describe('returns a resolved future', function() {
    var pureRes = { statusCode: 123, body: { isBody: true } };
    beforeEach(function() {
      outerRoute = route(function() {
        return Future.of(pureRes);
      });
      outerRoute(req, res, next);
    });

    it('should set the status', function() {
      res.status.calledWith(pureRes.statusCode).should.be.true;
    });

    it('should set the body', function() {
      res.send.calledWithMatch(pureRes.body).should.be.true;
    });

    it('should call next', function() {
      next.calledOnce.should.be.true;
    });
  });

  describe('returns a rejected future', function() {
    beforeEach(function() {
      outerRoute = route(function() {
        return Future.rejected({});
      });
      outerRoute(req, res, next);
    });

    it('should set the status', function() {
      res.status.calledWith(500).should.be.true;
    });

    it('should call next', function() {
      next.calledOnce.should.be.true;
    });
  });
}); 

