'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './UserLocation.events';

var UserLocationSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(UserLocationSchema);
export default mongoose.model('UserLocation', UserLocationSchema);
