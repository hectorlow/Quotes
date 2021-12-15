const express = require('express');
const router = express.Router();
const Quotes = require('../models/Quotes');
const { ensureAuth, ensureGuest } = require('../middleware/auth');

// @desc    Login page
// @route   GET /auth
router.get('/', ensureGuest, (req, res) => {
  res.redirect('/auth');
});

// @desc    User dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const quotes = await Quotes.find({ user: req.user.id }).lean()
  
    res.render('dashboard', {
      name: req.user.firstName,
      quotes,
    });
  } catch (err) {
    console.log('Dashboard error', err);
    res.render('error/500');
  }
})

module.exports = router;