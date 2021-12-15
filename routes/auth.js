const express = require('express');
const passport = require('passport');
const router = express.Router();
require('../config/passport')(passport);

// @desc    Login page
// @route   GET /auth
router.get('/', (req, res) => {
  res.render('login', { layout: 'login' });
})

// @desc    Google auth
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: 'profile' }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth' }), (req, res) => {
    console.log('google signin');
    res.redirect('/dashboard');
  }
);

// @desc    Logout api
// @route   GET /auth/logout
router.get('/logout', (req, res) => {
  req.logout();
  req.session = null;
  res.redirect('/');
})

module.exports = router;