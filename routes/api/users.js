// Handles registering Users.

const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route    POST api/users
// @desc     Register a User.
// @access   Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters.'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if the User exists.
      let user = await User.findOne({ email: email });

      if (user) {
        res.status(400).json({ errors: [{ msg: 'User already exists.' }] });
      }

      // Get User's Gravatar.
      const avatar = gravatar.url(email, {
        s: '200', // Size of image.
        r: 'pg', // Only pg-rated images.
        d: 'mm' // Provides a default fallback icon.
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      // Encrypt password using BCrypt.
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Return a jsonwebtoken so the User can be logged in.

      res.send('User registered.');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
