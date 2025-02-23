const { Schema, model } = require("mongoose"); 


const settingsSchema = new Schema(
  {
    siteTitle: { type: String, required: true },
    siteDescription: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String },
    socialLinks: { type: Map, of: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const settingsModel = model("Settings", settingsSchema);
module.exports = settingsModel;
