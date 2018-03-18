'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newUserLocation;

describe('UserLocation API:', function() {
  describe('GET /api/UserLocations', function() {
    var UserLocations;

    beforeEach(function(done) {
      request(app)
        .get('/api/UserLocations')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          UserLocations = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(UserLocations).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/UserLocations', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/UserLocations')
        .send({
          name: 'New UserLocation',
          info: 'This is the brand new UserLocation!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newUserLocation = res.body;
          done();
        });
    });

    it('should respond with the newly created UserLocation', function() {
      expect(newUserLocation.name).to.equal('New UserLocation');
      expect(newUserLocation.info).to.equal('This is the brand new UserLocation!!!');
    });
  });

  describe('GET /api/UserLocations/:id', function() {
    var UserLocation;

    beforeEach(function(done) {
      request(app)
        .get(`/api/UserLocations/${newUserLocation._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          UserLocation = res.body;
          done();
        });
    });

    afterEach(function() {
      UserLocation = {};
    });

    it('should respond with the requested UserLocation', function() {
      expect(UserLocation.name).to.equal('New UserLocation');
      expect(UserLocation.info).to.equal('This is the brand new UserLocation!!!');
    });
  });

  describe('PUT /api/UserLocations/:id', function() {
    var updatedUserLocation;

    beforeEach(function(done) {
      request(app)
        .put(`/api/UserLocations/${newUserLocation._id}`)
        .send({
          name: 'Updated UserLocation',
          info: 'This is the updated UserLocation!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedUserLocation = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedUserLocation = {};
    });

    it('should respond with the updated UserLocation', function() {
      expect(updatedUserLocation.name).to.equal('Updated UserLocation');
      expect(updatedUserLocation.info).to.equal('This is the updated UserLocation!!!');
    });

    it('should respond with the updated UserLocation on a subsequent GET', function(done) {
      request(app)
        .get(`/api/UserLocations/${newUserLocation._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let UserLocation = res.body;

          expect(UserLocation.name).to.equal('Updated UserLocation');
          expect(UserLocation.info).to.equal('This is the updated UserLocation!!!');

          done();
        });
    });
  });

  describe('PATCH /api/UserLocations/:id', function() {
    var patchedUserLocation;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/UserLocations/${newUserLocation._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched UserLocation' },
          { op: 'replace', path: '/info', value: 'This is the patched UserLocation!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedUserLocation = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedUserLocation = {};
    });

    it('should respond with the patched UserLocation', function() {
      expect(patchedUserLocation.name).to.equal('Patched UserLocation');
      expect(patchedUserLocation.info).to.equal('This is the patched UserLocation!!!');
    });
  });

  describe('DELETE /api/UserLocations/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/UserLocations/${newUserLocation._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when UserLocation does not exist', function(done) {
      request(app)
        .delete(`/api/UserLocations/${newUserLocation._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
