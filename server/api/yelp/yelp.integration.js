'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newYelp;

describe('Yelp API:', function() {
  describe('GET /api/yelps', function() {
    var yelps;

    beforeEach(function(done) {
      request(app)
        .get('/api/yelps')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          yelps = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(yelps).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/yelps', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/yelps')
        .send({
          name: 'New Yelp',
          info: 'This is the brand new yelp!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newYelp = res.body;
          done();
        });
    });

    it('should respond with the newly created yelp', function() {
      expect(newYelp.name).to.equal('New Yelp');
      expect(newYelp.info).to.equal('This is the brand new yelp!!!');
    });
  });

  describe('GET /api/yelps/:id', function() {
    var yelp;

    beforeEach(function(done) {
      request(app)
        .get(`/api/yelps/${newYelp._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          yelp = res.body;
          done();
        });
    });

    afterEach(function() {
      yelp = {};
    });

    it('should respond with the requested yelp', function() {
      expect(yelp.name).to.equal('New Yelp');
      expect(yelp.info).to.equal('This is the brand new yelp!!!');
    });
  });

  describe('PUT /api/yelps/:id', function() {
    var updatedYelp;

    beforeEach(function(done) {
      request(app)
        .put(`/api/yelps/${newYelp._id}`)
        .send({
          name: 'Updated Yelp',
          info: 'This is the updated yelp!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedYelp = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedYelp = {};
    });

    it('should respond with the updated yelp', function() {
      expect(updatedYelp.name).to.equal('Updated Yelp');
      expect(updatedYelp.info).to.equal('This is the updated yelp!!!');
    });

    it('should respond with the updated yelp on a subsequent GET', function(done) {
      request(app)
        .get(`/api/yelps/${newYelp._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let yelp = res.body;

          expect(yelp.name).to.equal('Updated Yelp');
          expect(yelp.info).to.equal('This is the updated yelp!!!');

          done();
        });
    });
  });

  describe('PATCH /api/yelps/:id', function() {
    var patchedYelp;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/yelps/${newYelp._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Yelp' },
          { op: 'replace', path: '/info', value: 'This is the patched yelp!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedYelp = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedYelp = {};
    });

    it('should respond with the patched yelp', function() {
      expect(patchedYelp.name).to.equal('Patched Yelp');
      expect(patchedYelp.info).to.equal('This is the patched yelp!!!');
    });
  });

  describe('DELETE /api/yelps/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/yelps/${newYelp._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when yelp does not exist', function(done) {
      request(app)
        .delete(`/api/yelps/${newYelp._id}`)
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
