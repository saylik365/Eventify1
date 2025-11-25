const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: String,
  rsvp: { type: String, enum: ['going', 'not-going', 'maybe', 'pending'], default: 'pending' },
  isVIP: { type: Boolean, default: false }
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  date: Date,
  time: String,
  location: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cohosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  guests: [guestSchema],
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
