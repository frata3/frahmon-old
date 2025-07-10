import autoBind from 'auto-bind';
import MainSettingsModel from '../models/settings.main.model.js';
import ColorsSettingsModel from '../models/settings.colors.model.js';
import IconsSettingsModel from '../models/settings.icons.model.js';

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
  async createColors(data) {
    return await this.#colorsModel.create(data);
  }

  async iconsFindOne() {
    return await this.#iconsModel.findOne();
  }
  async createIcons(data) {
    return await this.#iconsModel.create(data);
  }
}

export default new SettingsService();
