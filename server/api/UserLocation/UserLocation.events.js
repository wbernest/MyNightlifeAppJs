/**
 * UserLocation model events
 */

'use strict';

import {EventEmitter} from 'events';
var UserLocationEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UserLocationEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(UserLocation) {
  for(var e in events) {
    let event = events[e];
    UserLocation.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    UserLocationEvents.emit(event + ':' + doc._id, doc);
    UserLocationEvents.emit(event, doc);
  };
}

export {registerEvents};
export default UserLocationEvents;
