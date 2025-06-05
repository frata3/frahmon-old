const { Schema, model } = require("mongoose");


const topicSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  description: { type: String },
});

  
  module.exports = model('Topic', topicSchema);
  