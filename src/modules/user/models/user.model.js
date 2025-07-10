import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import syncUserToAllModules from '../../../common/utils/syncUser.util.js';

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.post("save", async function (doc) {
  await syncUserToAllModules(doc);
});

const UserModel = model("User", UserSchema);
export default UserModel;
