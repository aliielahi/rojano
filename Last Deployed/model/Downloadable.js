const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create schema
const DpwnloadableSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  author: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  field: {
    type: String,
    required: true
  }
});

module.exports = Downloadable = mongoose.model('downloadables', DpwnloadableSchema);