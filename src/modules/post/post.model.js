const { Schema, model } = require("mongoose");

const postSchema = new Schema(
    {
      titlePath: { type: String, required: true }, 
      title: { type: String, required: true },
      description: { type: String, required: true }, 
      content: { type: String, required: true }, 
      thumbnail: { type: String }, 
      category: { type: String, required: true }, 
      tags: { type: [String], default: [] }, 
      author: { type: String, required: true }, 
      isPublished: { type: Boolean, default: false }, 
      publishDate: { type: Date }, 
      views: { type: Number, default: 0 }, 
    },
    { timestamps: true } 
  );

const blogPost = model("posts", postSchema);

module.exports = blogPost;
