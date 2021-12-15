const mongoose = require('mongoose');

const QuoteSchema = mongoose.Schema({
  author: {
    type: String,
  },
  quote: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Quote', QuoteSchema);
