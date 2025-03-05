const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
  thread: { type: mongoose.Schema.Types.ObjectId, ref: "Thread", required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Reply", default: null }
});

module.exports = mongoose.model("Reply", ReplySchema);

