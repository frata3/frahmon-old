const autoBind = require("auto-bind");
const SettingsModel = require("./settings.model");

class SettingsService {
  #model;
  constructor() {
    autoBind(this);
    this.#model = SettingsModel;
  }
  async getSetting() {
    const setting = await this.#model.findOne();
      return setting;
  }
  
}
module.exports = new SettingsService();
