const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  colors: { type: mongoose.Schema.Types.ObjectId, ref: 'SettingColors' },
  icons: { type: mongoose.Schema.Types.ObjectId, ref: 'SettingIcons' },
});



module.exports = mongoose.model('Settings', settingsSchema);