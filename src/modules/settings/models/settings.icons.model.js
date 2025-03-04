const mongoose = require('mongoose');

const iconsSchema = new mongoose.Schema({
  logo: { type: String, default: './' },
  favicon: { type: String, default: './' },
});

module.exports = mongoose.model('SettingIcons', iconsSchema);