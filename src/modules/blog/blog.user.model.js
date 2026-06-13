import { Schema } from "mongoose";
import { getConnection } from "../../config/mongoose.config.js";

const BlogUserSchema = new Schema(
  {
    _id: String,
    username: String,
    fullname: String,
    avatar: {type: String, default: "/assets/pictures/default-avatar.png"},
  },
  { timestamps: true }
);

const blogConnection = await getConnection(
  "blogDB",
  process.env.MONGODB_BLOG_URL
);
const blogUser = blogConnection.model("User", BlogUserSchema);

export default blogUser;
