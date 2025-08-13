const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, required: true },
  details: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);
