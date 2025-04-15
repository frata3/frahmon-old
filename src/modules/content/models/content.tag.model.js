const { Schema, model } = require("mongoose");


const tagSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, 
    topic: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
  });
  
  module.exports = model('Tag', tagSchema);
  