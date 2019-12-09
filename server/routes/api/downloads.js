const express = require('express');
const passport = require('passport');
const path = require('path');
const fs = require('fs');

// Load Downloadable module
const Downloadable = require('../../model/Downloadable');

const router = express.Router();

router.get('/test', (req, res) => res.json({ msg: 'downloads Works' }));

// @route   POST api/download/download
// @desc    Register user
// @access  Public
router.post('/download', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.download(path.resolve('uploads', `${req.body.fileName}`));
});

// @route   GET/API/download/all
// @desc		return all downloadable files
// @access  private
router.get('/all', passport.authenticate('jwt', { session: false }), (req, res) => {
	Downloadable.find()
		.then(files => {
		if (!files) {
			errors.noUser = 'There are no downloadable sources';
			return res.status(404).json(errors);
		}
		let classNotes = [];
		let questions = [];
		for (let i = 0; i < files.length; i++) {
			if(files[i].type==='classNotes') {
				classNotes.push(files[i])
			} else {
				questions.push(files[i])
			}
		}
		res.json({
			classNotes: classNotes,
			questions: questions
		});
		})
		.catch(err => res.status(404).json({ users: 'There are no downloadable sources' }));
});

// @route   POST api/download/addfile
// @desc    add a file
// @access  Private
router.post('/addfile', passport.authenticate('jwt', { session: false }), ( req, res ) => {
	if(req.user.email !== 'admin@rojano.com')
		return res.status(404).send('Unauthorized');
	const newFile = new Downloadable({
		fileName: req.body.fileName,
		date: req.body.date,
		author: req.body.author,
    field: req.body.field,
    details: req.body.details,
		name: req.body.name,
		type: req.body.type
	});
	newFile
		.save()
		.then(file => res.json(file))
		.catch(console.log);
});

module.exports = router;