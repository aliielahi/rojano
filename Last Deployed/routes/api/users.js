const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User module
const User = require('../../model/User');
// Load Course module
const Course = require('../../model/Course');


// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);
	if(!isValid) return res.status(400).json(errors);
	User.findOne({ email: req.body.email })
		.then(user => {
			if(user) {
				errors.email = 'این ایمیل قبلا استفاده شده است';
				return res.status(400).json(errors);
			} else {
				const newUser = new User({
					name: req.body.name,
					email: req.body.email,
					state: req.body.state,
					phoneNumber: req.body.phoneNumber,
					homeNumber: req.body.homeNumber,
					password: req.body.password,
					grade: req.body.grade,
					school: req.body.school,
					field: req.body.field
				});

				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if(err) throw err;
						newUser.password = hash;
						newUser.save()
							.then(user => res.json(user))
							.catch(err => console.log(err));
					});
				});
			}

		})
		.catch(err => console.log(err));
});

// @route   POST api/users/login
// @desc    Login user/ returning jwt
// @access  Public
router.post('/login', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	const { errors, isValid } = validateLoginInput(req.body);
	if(!isValid) return res.status(400).json(errors);

	// find user by email
	User.findOne({email})
		.then(user => {
			if(!user) {
				errors.email = "این ایمیل در سامانه وجود ندارد";
				return res.status(404).json(errors);
			} 
			bcrypt.compare(password, user.password)
				.then(isMached => {
					if(isMached) {
						const payload = { id : user.id, name : user.name, email: user.email };
						// 	Sign token
						jwt.sign(
							payload,
							keys.secretOrkey,
							{ expiresIn: 36000 },
							(err, token) => {
								res.json({ 
									success: true,
									token: 'Bearer ' + token
								});
							});
					} else {
						errors.password = 'رمز عبور غلط است';
						return res.status(400).json(errors);
					}
				});
		});
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/currnet', passport.authenticate('jwt', { session: false }),  (req, res) => {
	res.json({
		id: req.user.id,
		email: req.user.email,
		name: req.user.name,
		state: req.user.state,
		phoneNumber: req.user.phoneNumber,
		grade: req.user.grade,
		enroledCources: req.user.enroledCources
	});
});

// @route   GET/API/users/all
// @desc		return all users
// @access  private only the admin@rojano.com with pqowieowurowieow
router.get('/all', passport.authenticate('jwt', { session: false }), (req, res) => {
	if(req.user.email !== 'admin@rojano.com')
		return res.status(404).send('Unauthorized');
	User.find()
		.then(users => {
		if (!users) {
			errors.noUser = 'There are no profiles';
			return res.status(404).json(errors);
		}
		res.json(users);
		})
		.catch(err => res.status(404).json({ users: 'There are no profiles' }));
});

// @route   GET/API/users/addcourse
// @desc		add course to a user and user to course
// @access  private
router.post('/addcourse', passport.authenticate('jwt', { session: false }), ( req, res ) => {
	const { courseId } = req.body;
	const errors = {};
	User.findById({ _id: req.user.id })
	  .then(user => {
		if (!user) {
		  errors.noUser = 'There is no User for this id';
		  res.status(404).json(errors);
		}
		Course.findById({ _id : courseId })
			.then(course => {
				if(!course) {
					errors.noCourse = 'There is no Course for this id';
					res.status(404).json(errors);
				}
				//check if course is already exsist in user's courses
				if (user.enroledCources.filter(c => c.toString() === courseId).length) {
					errors.courseexists = 'course already exists in users course array';
					return res.status(404).json(errors);
		  		}
		  		// Add to course to student's courses array
				user.enroledCources.unshift(courseId);
				course.students.unshift(user.id);
				course.save();
				user.save().then(user => {
					if(user) {
						let usersCourses = [];
						let otherCourses = [];
						usersEnroledCourses = req.user.enroledCources;
						Course.find()
							.then(allCourses => {
								usersCourses = allCourses.filter(c => usersEnroledCourses.includes(c._id));
								otherCourses = allCourses.filter(c => !usersEnroledCourses.includes(c._id));
								res.status(200).json({
									usersCourses: usersCourses,
									otherCourses: otherCourses
								});
							})
							.catch(console.log)
					}
				});
			})
			.catch(err => console.log(err));
	  })
});

// @route   GET/API/users/removecourse
// @desc		remove course from a user's courses list and user from course's student list
// @access  private
router.post('/removecourse', passport.authenticate('jwt', { session: false }), (req, res ) => {
	const { courseId } = req.body;
	const errors = {};
	const userId = req.user.id;
	User.findById({ _id: userId })
		.then(user => {
			if (!user) {
				errors.noUser = 'There is no user for this id';
				res.status(404).json(errors);
			}
			Course.findById({ _id : courseId })
				.then(course => {
					if(!course) {
						errors.noCourse = 'There is no Course for this id';
						res.status(404).json(errors);
					}
					//check if course exsist in user's courses
					if (!user.enroledCources.filter(course => course.toString() === courseId).length) {
						errors.studentDoesNotExists = 'user does not have this course';
						return res.status(404).json(errors);
					}
					//check if user exsist in course's students
					if (!course.students.filter(s => s.toString() === userId).length) {
						errors.courseDoesNotExists = 'course does not have this student this should never happen';
						return res.status(404).json(errors);
					}
					// Get remove index from user courses
					const removeIndexFromUserCourses = user.enroledCources
						.map(item => item.toString())
						.indexOf(courseId);
					// Get remove index from course students
					const removeIndexFromCourseStudents = course.students
						.map(item => item.toString())
						.indexOf(userId);
					// Splice student out of array
					course.students.splice(removeIndexFromCourseStudents, 1);
					course.save();
					// Splice course out of array
					user.enroledCources.splice(removeIndexFromUserCourses, 1);
					user.save().then(user => {
						if(user) {
							let usersCourses = [];
							let otherCourses = [];
							usersEnroledCourses = req.user.enroledCources;
							Course.find()
								.then(allCourses => {
									usersCourses = allCourses.filter(c => usersEnroledCourses.includes(c._id));
									otherCourses = allCourses.filter(c => !usersEnroledCourses.includes(c._id));
									res.status(200).json({
										usersCourses: usersCourses,
										otherCourses: otherCourses
									});
								})
								.catch(console.log)
						}
					}
					);
					
				})
		})
		.catch(err => res.status(400).json({ postnotfound: 'No post found' }));
})

// @route   GET/API/users/mycourse
// @desc	returns 2 array 1, user's courses 2, other courses
// @access  private
router.get('/mycourse', passport.authenticate('jwt', { session: false }), (req, res ) => {
	let usersCourses = [];
	let otherCourses = [];
	usersEnroledCourses = req.user.enroledCources;
	Course.find()
		.then(courses => {
			usersCourses = courses.filter(c => usersEnroledCourses.includes(c._id));
			otherCourses = courses.filter(c => !usersEnroledCourses.includes(c._id));
			let publicClasses = otherCourses.filter(a => {
				return a.type === 'Public'
			});
			res.status(200).json({
				usersCourses: usersCourses,
				otherCourses: publicClasses
			});
		})
		.catch(console.log)
})
module.exports = router;