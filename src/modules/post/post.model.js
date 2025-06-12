const { Schema, model, Types } = require("mongoose");

const postSchema = new Schema(
  {
    slug: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Types.ObjectId, ref: "User" },
    tags: [{ type: Types.ObjectId, ref: "Tag" }],
  },
  { timestamps: true }
);

postSchema.pre("save", function (next) {
  if (this.tags && this.tags.length > 0) {
    this.tags = this.tags.map((tag) => Types.ObjectId(tag)
  );
  }
  next();
});

const blogPost = model("posts", postSchema);
module.exports = blogPost;
