const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create schema
const CourseSchema = new Schema({
  courseName: {
    type: String,
    required: true
  },
  courseTeacher: {
    type: String,
    required: true
  },
  courseDetails: {
    type: String,
    required: true
  },
  courseYear: {
    type: String,
    required: false
  },
  courseMonth: {
    type: String,
    required: false
  },
  courseDay: {
    type: String,
    required: false
  },
  courseDayInWeek: {
    type: String,
    required: false
  },
  periodic: {
    type: Boolean,
    required: true
  },
  NumberOfSessions: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  classCode: {
    type: String,
    required: true
  },
  students: []
});

module.exports = Course = mongoose.model('courses', CourseSchema);