const { Schema: Schema, model: model, Types: Types } = require("mongoose"),
  MessageSchema = new Schema({
    sender: { type: Types.ObjectId, ref: "User", required: !0 },
    chat: { type: Types.ObjectId, ref: "Chat", required: !0 },
    content: { type: String, default: "" },
    replyTo: { type: Types.ObjectId, ref: "Message" },
    reactions: [
      { user: { type: Types.ObjectId, ref: "User" }, emoji: { type: String } },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }),
  MessageModel = model("Message", MessageSchema);
module.exports = MessageModel;
