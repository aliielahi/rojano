const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: false
  },
  homeNumber: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  grade: {
    type: String,
    required: true
  },
  school: {
    type: String,
    required: true
  },
  field: {
    type: String,
    required: true
  },
  enroledCources: [],
  classApplications: []
});

module.exports = User = mongoose.model('users', UserSchema);