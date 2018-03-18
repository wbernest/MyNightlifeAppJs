'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './UserLocation.events';

var UserLocationSchema = new mongoose.Schema({
  userName: String,
  locationId: String,
  date: String
});

registerEvents(UserLocationSchema);
export default mongoose.model('UserLocation', UserLocationSchema);
