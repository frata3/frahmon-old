const mongoose = require('mongoose');

const colorsSchema = new mongoose.Schema({
  backgroundColor: { type: String, default: '#ffffff' },
  primaryColor: { type: String, default: '#3498db' },
  secondaryColor: { type: String, default: '#2ecc71' },
});

module.exports = mongoose.model('SettingColors', colorsSchema);