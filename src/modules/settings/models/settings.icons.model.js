const {Schema, model} = require('mongoose');

const iconsSchema = new Schema({
  logo: { type: String, default: './' },
  favicon: { type: String, default: './' },
});

module.exports = model('Icons', iconsSchema);