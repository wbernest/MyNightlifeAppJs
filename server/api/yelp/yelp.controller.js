/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/yelps              ->  index
 * POST    /api/yelps              ->  create
 * GET     /api/yelps/:id          ->  show
 * PUT     /api/yelps/:id          ->  upsert
 * PATCH   /api/yelps/:id          ->  patch
 * DELETE  /api/yelps/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Yelp from './yelp.model';
import yelpFusion from 'yelp-fusion';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Yelps
export function index(req, res) {
  return Yelp.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Yelp from the DB
export function show(req, res) {
  const client = yelpFusion.client('yopxkPyI73fQ2D7ytBm1xQQXquYZS-_tP9_lpJjIw2tGQkNK_3RbVR5HvQV1TZuDuWR87R7EvqIDcM26ODtWTaIOfUTuT1xJAiBgTAGyq_F79-iCa07HPYlBdv2qWnYx');

  return client.search({
    term:'bar',
    location: req.params.id
  }).then(respondWithResult(res)).catch(handleError(res))
}

// Creates a new Yelp in the DB
export function create(req, res) {
  return Yelp.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Yelp in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Yelp.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Yelp in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Yelp.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Yelp from the DB
export function destroy(req, res) {
  return Yelp.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
