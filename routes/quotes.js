const express = require('express');
const router = express.Router();
const Quote = require('../models/Quotes');
const { ensureAuth } = require('../middleware/auth');

// @desc    Public quotes
// @route   GET /quotes
router.get('/', ensureAuth, async (req, res) => {
  try {
    const quotes = await Quote.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();

    res.render('quotes/quotes', { quotes });
  } catch (err) {
    console.log('Error showing quotes', err);
    res.render('error/500');
  }
});

// @desc    Add quotes
// @route   GET /quotes/add
router.get('/add', (req, res) => {
  res.render('quotes/add');
});

// @desc    Submit quote
// @route   POST /quotes
router.post('/', async (req, res) => {
  try {
    req.body['user'] = req.user.id;
    await Quote.create(req.body);
    res.redirect('/dashboard');
  } catch (err) {
    console.log('Error creating quote', err);
    res.render('error/500');
  }
  // try create quote
  // redirect on success or failure
})

// @desc    Edit quote page
// @route   GET /quote/edit/:id
router.get('/edit/:id', async (req, res) => {
  try {
    const quote = await Quote.findOne({ _id: req.params.id }).lean();

    if (!quote) {
      return res.render('error/404');
    }

    if (quote.user != req.user.id) {
      res.redirect('/quotes');
    } else {
      res.render('quotes/edit', { quote });
    }

  } catch (err) {
    console.log(err);
    res.render('error/404');
  }
});

// @desc    Single quote page
// @route   GET /quote/:id
router.get('/:id', async (req, res) =>  {
  try {
    const quote = await Quote.findOne({ _id: req.params.id })
      .populate('user')
      .lean();
    res.render('quotes/quote', { quote });
  } catch (err) {
    console.log('Error rendering quote', err);
    res.redirect('error/404');
  }
})

// @desc    Update quote
// @route   PUT /quote/:id
router.put('/:id', async (req, res) =>  {
  console.log('put request');
  try {
    let quote = await Quote.findById({ _id: req.params.id }).lean();

    if (!quote) res.render('error/404');

    if (quote.user != req.user.id) {
      res.redirect('/quotes');
    } else {
      quote = await Quote.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      console.log(quote, 'new quote');

      res.redirect('/dashboard');
    }

  } catch (err) {
    console.log('Error updating quote', err);
    res.redirect('error/404');
  }
});

// @desc    Delete quote
// @route   DELETE /quote/:id
router.delete('/:id', async (req, res) => {
  try {
    await Quote.remove({ _id: req.params.id });
    res.redirect('/dashboard');
  } catch (err) {
    console.log('Error deleting quote', err);
    res.render('error/404');
  }
})


// @desc    User stories
// @route   GET /quotes/user/:id
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const quotes = await Quote.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean();
    res.render('quotes/quotes', { quotes });
  } catch (err) {
    console.log('Error getting user quotes', err);
    res.render('error/404');
  }
})


module.exports = router;