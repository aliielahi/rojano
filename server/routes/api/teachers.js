const express = require('express');
const router = express.Router();

// @route   GET api/teachers/test
// @desc    Tests teachers route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Teachers Works' }));

module.exports = router;