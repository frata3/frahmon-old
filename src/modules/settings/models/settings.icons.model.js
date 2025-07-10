import { Schema, model } from 'mongoose';

const iconsSchema = new Schema({
  logo: { type: String, default: './' },
  favicon: { type: String, default: './' },
});

export default model('Icons', iconsSchema);