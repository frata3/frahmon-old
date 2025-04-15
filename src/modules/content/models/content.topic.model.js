const { Schema, model } = require("mongoose");


const topicSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String },
  });
  
  module.exports = model('Topic', topicSchema);
  