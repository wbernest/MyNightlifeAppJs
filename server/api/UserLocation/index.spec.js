'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var UserLocationCtrlStub = {
  index: 'UserLocationCtrl.index',
  show: 'UserLocationCtrl.show',
  create: 'UserLocationCtrl.create',
  upsert: 'UserLocationCtrl.upsert',
  patch: 'UserLocationCtrl.patch',
  destroy: 'UserLocationCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var UserLocationIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './UserLocation.controller': UserLocationCtrlStub
});

describe('UserLocation API Router:', function() {
  it('should return an express router instance', function() {
    expect(UserLocationIndex).to.equal(routerStub);
  });

  describe('GET /api/UserLocations', function() {
    it('should route to UserLocation.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'UserLocationCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/UserLocations/:id', function() {
    it('should route to UserLocation.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'UserLocationCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/UserLocations', function() {
    it('should route to UserLocation.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'UserLocationCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/UserLocations/:id', function() {
    it('should route to UserLocation.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'UserLocationCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/UserLocations/:id', function() {
    it('should route to UserLocation.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'UserLocationCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/UserLocations/:id', function() {
    it('should route to UserLocation.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'UserLocationCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
