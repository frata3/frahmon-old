const {Schema, model} = require('mongoose');

const settingsSchema = new Schema({
  colors: { type: Schema.Types.ObjectId, ref: 'Colors' },
  icons: { type: Schema.Types.ObjectId, ref: 'Icons' },
});



module.exports = model('Settings', settingsSchema);