const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create schema
const ApplicationSchema = new Schema({
  subject: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  applicantName: {
    type: String,
    required: false
  },
  applicantID: {
    type: String,
    required: false
  },
  applicantEmail: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  },
});

module.exports = ClassApplication = mongoose.model('applications', ApplicationSchema);