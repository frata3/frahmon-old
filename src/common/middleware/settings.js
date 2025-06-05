const SettingsService = require("../../modules/settings/services/settings.service");

async function settingsLoader(req, res, next) {
  try {
    const settings = await SettingsService.getSettings();
    res.locals.settings = settings;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = settingsLoader;
