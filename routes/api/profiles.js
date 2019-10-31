// Has routes that has to do with Profiles. Fetching, adding, updating.

const express = require('express');
const router = express.Router();

// @route    GET api/profile
// @desc     Test route.
// @access   Public
router.get('/', (req, res) => res.send('Profile route.'));

module.exports = router;
