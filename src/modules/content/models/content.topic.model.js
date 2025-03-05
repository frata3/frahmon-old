const mongoose = require('mongoose');


const topicSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String },
  });
  
  module.exports = mongoose.model('Topic', topicSchema);
  