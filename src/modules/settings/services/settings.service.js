const autoBind = require("auto-bind");
const MainSettingsModel = require("../models/settings.main.model");
const ColorsSettingsModel = require("../models/settings.colors.model");
const IconsSettingsModel = require("../models/settings.icons.model");

class SettingsService {
  #mainModel;
  #colorsModel;
  #iconsModel;

  constructor() {
    autoBind(this);
    this.#mainModel = MainSettingsModel;
    this.#colorsModel = ColorsSettingsModel;
    this.#iconsModel = IconsSettingsModel;
  }

  async getSettings() {
    return await this.#mainModel.findOne().populate("colors icons");
  }
  async createSettings(data) {
    return await this.#mainModel.create(data);
  }

  async colorsFindOne() {
    return await this.#colorsModel.findOne();
  }
  async createInColors(data) {
    return await this.#colorsModel.create(data);
  }

  async iconsFindOne() {
    return await this.#iconsModel.findOne();
  }
  async createInIcons(data) {
    return await this.#iconsModel.create(data);
  }
}

module.exports = new SettingsService();
