import SettingsService from '../../modules/settings/services/settings.service.js';

async function settingsLoader(req, res, next) {
  try {
    const settings = await SettingsService.getSettings();
    res.locals.settings = settings;
    next();
  } catch (error) {
    next(error);
  }
}

export default settingsLoader;
