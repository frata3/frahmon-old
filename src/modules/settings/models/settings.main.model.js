import { Schema, model } from 'mongoose';

const settingsSchema = new Schema({
  colors: { type: Schema.Types.ObjectId, ref: 'Colors' },
  icons: { type: Schema.Types.ObjectId, ref: 'Icons' },
});



export default model('Settings', settingsSchema);