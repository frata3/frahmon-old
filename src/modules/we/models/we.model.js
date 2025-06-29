const { Schema: Schema, model: model, Types: Types } = require("mongoose"),
  ChatSchema = new Schema({
    type: { type: String, enum: ["private", "group"], required: !0 },
    name: { type: String },
    members: [{ type: Types.ObjectId, ref: "User" }],
    admins: [{ type: Types.ObjectId, ref: "User" }],
    lastMessage: { type: Types.ObjectId, ref: "Message" },
    createdAt: { type: Date, default: Date.now },
  }),
  ChatModel = model("Chat", ChatSchema);
module.exports = ChatModel;
