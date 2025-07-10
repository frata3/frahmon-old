import { Schema, model } from 'mongoose';

const colorsSchema = new Schema({
  bodyBackgroundColor: { type: String, default: "#ffffff" },
  navBackgroundColor: { type: String, default: "#ffffff" },
  mainBackgroundColor: { type: String, default: "#ffffff" },
  containerBackgroundColor: { type: String, default: "#ffffff" },
  primaryColor: { type: String, default: "#3498db" },
  secondaryColor: { type: String, default: "#2ecc71" },
});

export default model("Colors", colorsSchema);
