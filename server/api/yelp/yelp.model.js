'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './yelp.events';

var YelpSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(YelpSchema);
export default mongoose.model('Yelp', YelpSchema);
