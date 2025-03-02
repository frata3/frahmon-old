const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  titlePath: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
});

const blogPost = model("posts", postSchema);

module.exports = blogPost;
