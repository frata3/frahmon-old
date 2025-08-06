import { Schema, model, Types } from 'mongoose';
import { getConnection } from '../../../config/mongoose.config.js';
const ConnectionSchema = new Schema({
  source: { type: Types.ObjectId, ref: "User", required: true },
  target: { type: Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["follow", "block", "friend_request", "mute", "report"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "active", "inactive"],
    default: "active",
  },
  meta: {
    note: String,
    visibility: { type: String, enum: ["public", "private"], default: "public" },
    allow_groups: Boolean,
    allow_dm: Boolean, 
    mutual_consent: Boolean, 
    blocked_reason: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
ConnectionSchema.index({ source: 1, target: 1, type: 1 }, { unique: true });
const coreConnection = await getConnection("coreDB", process.env.MONGODB_CORE_URL);
const Connection = coreConnection.model('Connection', ConnectionSchema);
export default Connection;