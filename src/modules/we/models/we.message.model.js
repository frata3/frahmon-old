import { Schema, model, Types } from "mongoose";
import { getConnection } from "../../../config/mongoose.config.js";

const MessageSchema = new Schema({
  sender: { type: Types.ObjectId, ref: "User", required: !0 },
  chat: { type: Types.ObjectId, ref: "Chat", required: !0 },
  content: { type: String, default: "" },
  replyTo: { type: Types.ObjectId, ref: "Message" },
  reactions: [
    { user: { type: Types.ObjectId, ref: "User" }, emoji: { type: String } },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


const coreConnection = await getConnection("coreDB", process.env.MONGODB_CORE_URL);
const MessageModel = coreConnection.model("Message", MessageSchema);
export default MessageModel;