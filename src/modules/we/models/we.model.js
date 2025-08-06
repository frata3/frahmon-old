import { Schema, model, Types } from "mongoose";
import { getConnection } from '../../../config/mongoose.config.js';

const ChatSchema = new Schema({
  type: { type: String, enum: ["private", "group"], required: !0 },
  name: { type: String },
  members: [{ type: Types.ObjectId, ref: "User" }],
  admins: [{ type: Types.ObjectId, ref: "User" }],
  lastMessage: { type: Types.ObjectId, ref: "Message" },
  createdAt: { type: Date, default: Date.now },
});


const coreConnection = await getConnection("coreDB", process.env.MONGODB_CORE_URL);
const ChatModel = coreConnection.model("Chat", ChatSchema);

export default ChatModel;