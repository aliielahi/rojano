const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load input validation
const validateApplicationInput = require('../../validation/classApplication');

// Load User module
const User = require('../../model/User');

// Load Course module
const ClassApplication = require('../../model/ClassApplication');

// @route   GET api/classapplications/test
// @desc    Tests classapplications route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'class Applications Works' }));

// @route   POST api/classapplications/apply
// @desc    add a course
// @access  Private
router.post('/apply', passport.authenticate('jwt', { session: false }), ( req, res ) => {
  const { errors, isValid } = validateApplicationInput(req.body);
  if(!isValid) return res.status(400).json(errors);
	const newApplication = new ClassApplication({
		applicantEmail: req.body.applicantEmail,
		applicantID: req.body.applicantID,
		applicantName: req.body.applicantName,
		details: req.body.details,
		subject: req.body.subject,
		type: req.body.type,
	});
	newApplication
		.save()
		.then(cap => {
      User.findById({ _id: cap.applicantID })
        .then(user => {
					user.classApplications.unshift(cap._id);
					user.save() .then(a => {
						res.status(200).json({status: 'okay'})
					})
        })
        .catch(console.log)
    })
		.catch(console.log);
});

// @route   POST api/classapplications/deleteapplication
// @desc    delete an application by user
// @access  Private
router.post('/deleteapplication', passport.authenticate('jwt', { session: false }), ( req, res ) => {
  const { applicationId, userId } = req.body;
  const errors = {};
	User.findById({ _id: userId })
		.then(user => {
			if (!user) {
				errors.noUser = 'There is no user for this id';
				res.status(404).json(errors);
			}
			ClassApplication.findById({ _id : applicationId })
				.then(cap => {
					if(!cap) {
						errors.noCourse = 'There is no application for this id';
						res.status(404).json(errors);
					}
					const removeIndexFromUserApplications = user.classApplications
						.map(item => item.toString())
						.indexOf(applicationId);
					//Splice course out of array
					user.classApplications.splice(removeIndexFromUserApplications, 1);
          user
          .save()
          .then(user1 => {
            let usersApplications = [];
            usersApps = user1.classApplications;
            ClassApplication.find()
              .then(cap => {
								usersApplications = cap.filter(c => usersApps.includes(c._id));
								ClassApplication.findByIdAndRemove({ _id: applicationId }).catch(console.log);
                res.status(200).json({
                  usersApplications: usersApplications,
                });
              })
              .catch(console.log)
					});
				})
		})
		.catch(err => res.status(400).json({ postnotfound: 'No post found' }));
})

// @route   POST api/classapplications/myapplications
// @desc    delete an application by user
// @access  Private
router.get('/myapplications', passport.authenticate('jwt', { session: false }), ( req, res ) => {
	let usersApplications = [];
	usersApps = req.user.classApplications;
	ClassApplication.find()
		.then(cap => {
			usersApplications = cap.filter(c => usersApps.includes(c._id));
			res.status(200).json({
				usersApplications: usersApplications,
			});
		})
		.catch(console.log)
});

// @route   GET api/classapplications/allapplications
// @desc    Get all applications
// @access  Public only admin
router.get('/allapplications', passport.authenticate('jwt', { session: false }), ( req, res ) => {
  if(req.user.email !== 'admin@rojano.com')
		return res.status(404).send('Unauthorized');
	ClassApplication.find()
		.then(aps => {
			if (!aps) {
				errors.nocourse = 'There are no applications';
				return res.status(404).json(errors);
			}
			res.json(aps);
		});
});

module.exports = router;