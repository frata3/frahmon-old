import { Schema } from "mongoose";
import bcrypt from "bcrypt";
import syncUserToAllModules from "../../../config/syncUser.config.js";
import { getConnection } from "../../../config/mongoose.config.js";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    avatar: { type: String, default: "/assets/pictures/default-avatar.png" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.post("save", async (user) => {
  await syncUserToAllModules(user);
});

const coreConnection = await getConnection(
  "coreDB",
  process.env.MONGODB_CORE_URL
);
const UserModel = coreConnection.model("User", UserSchema);

export default UserModel;
