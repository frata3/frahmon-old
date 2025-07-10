import { Schema, model, Types } from 'mongoose';
const ChatSchema = new Schema({
        type: { type: String, enum: ["private", "group"], required: !0 },
        name: { type: String },
        members: [{ type: Types.ObjectId, ref: "User" }],
        admins: [{ type: Types.ObjectId, ref: "User" }],
        lastMessage: { type: Types.ObjectId, ref: "Message" },
        createdAt: { type: Date, default: Date.now },
      }),
      ChatModel = model("Chat", ChatSchema);
export default ChatModel;
