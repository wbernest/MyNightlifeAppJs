'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var yelpCtrlStub = {
  index: 'yelpCtrl.index',
  show: 'yelpCtrl.show',
  create: 'yelpCtrl.create',
  upsert: 'yelpCtrl.upsert',
  patch: 'yelpCtrl.patch',
  destroy: 'yelpCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var yelpIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './yelp.controller': yelpCtrlStub
});

describe('Yelp API Router:', function() {
  it('should return an express router instance', function() {
    expect(yelpIndex).to.equal(routerStub);
  });

  describe('GET /api/yelps', function() {
    it('should route to yelp.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'yelpCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/yelps/:id', function() {
    it('should route to yelp.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'yelpCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/yelps', function() {
    it('should route to yelp.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'yelpCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/yelps/:id', function() {
    it('should route to yelp.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'yelpCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/yelps/:id', function() {
    it('should route to yelp.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'yelpCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/yelps/:id', function() {
    it('should route to yelp.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'yelpCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
