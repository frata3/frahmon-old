import { Schema, Types } from 'mongoose';
import { getConnection } from '../../config/mongoose.config.js';
import { nanoid } from 'nanoid';
// import { customAlphabet } from 'nanoid';
// const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 12);

const postSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => nanoid(10)
    },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, default: "blog" },
    description: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Types.ObjectId, ref: "User" },
    // tags: [{ type: Types.ObjectId, ref: "Tag" }],
  },
  { timestamps: true }
);

// postSchema.pre("save", function (next) {
//   if (this.tags && this.tags.length > 0) {
//     this.tags = this.tags.map((tag) => Types.ObjectId(tag)
//   );
//   }
//   next();
// });

const blogConnection = await getConnection("blogDB", process.env.MONGODB_BLOG_URL);
const blogPost = blogConnection.model('posts', postSchema);

export default blogPost;
