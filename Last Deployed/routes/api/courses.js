const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load Course module
const Course = require('../../model/Course');

// @route   GET api/courses/test
// @desc    Tests courses route
// @access  Public
router.post('/test', (req, res) => res.json({ msg: 'Coureses Works' }));

// @route   POST api/courses/addcourse
// @desc    add a course
// @access  Private only admin
router.post('/addcourse', passport.authenticate('jwt', { session: false }), ( req, res ) => {
	if(req.user.email !== 'admin@rojano.com')
  		return res.status(404).send('Unauthorized');
	const newCourse = new Course({
		courseName: req.body.courseName,
		courseTeacher: req.body.courseTeacher,
		courseDetails: req.body.courseDetails,
		courseYear: req.body.courseYear,
		courseMonth: req.body.courseMonth,
		courseDay: req.body.courseDay,
		courseDayInWeek: req.body.courseDayInWeek,
		periodic: req.body.periodic,
		NumberOfSessions: req.body.NumberOfSessions,
		type: req.body.type,
		classCode: req.body.classCode,
	});
	newCourse
		.save()
		.then(course => res.json(course))
		.catch(console.log);
});

// @route   GET api/courses/allcourses
// @desc    Get all courses
// @access  Public
router.get('/allcourses', ( req, res ) => {
	Course.find()
		.then(courses => {
			if (!courses) {
				errors.nocourse = 'There are no courses';
				return res.status(404).json(errors);
			}
			res.json(courses);
		});
});

module.exports = router;