const autoBind = require("auto-bind");
const SettingsService = require("./settings.service");

class SettingsController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = SettingsService;
  }
  async findConfigs(req, res, next) {
    try {
        const settings = await this.#service.getSetting();
        return settings
      } catch (error) {
        next(error);
      }
  }
  
}

module.exports = new SettingsController();
