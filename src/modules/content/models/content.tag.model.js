const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
  });
  
  module.exports = mongoose.model('Tag', tagSchema);
  