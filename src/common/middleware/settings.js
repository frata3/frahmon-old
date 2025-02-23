const SettingsService = require("../../modules/settings/settings.service");

async function settingsLoader(req, res, next) {
  try {
    const settings = await SettingsService.getSetting();
    res.locals.settings = settings;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = settingsLoader;
