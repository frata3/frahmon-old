const { Schema, model, Types } = require("mongoose");

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
    allow_dm: Boolean, // direct message
    mutual_consent: Boolean, // برای نوع‌هایی مثل friend_request
    blocked_reason: String,
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ConnectionSchema.index({ source: 1, target: 1, type: 1 }, { unique: true });

const Connection = model("Connection", ConnectionSchema);
module.exports = Connection;
