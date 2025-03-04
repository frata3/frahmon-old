const settingsService = require("../../modules/settings/services/settings.service");

const initialColors = {
  backgroundColor: "#ffffff",
  primaryColor: "#3498db",
  secondaryColor: "#2ecc71",
};

const initialIcons = {
  icon: "./",
  favicon: "./",
};

const initialSettings = {
  colors: null,
  icons: null,
};

async function seedDatabase() {
  try {
    let colors = await settingsService.colorsFindOne();
    if (!colors) {
      colors = await settingsService.createInColors(initialColors);
      console.log("Default colors added.");
    } else {
      console.log("Colors already exist. Skipping...");
    }

    let icons = await settingsService.iconsFindOne();
    if (!icons) {
      icons = await settingsService.createInIcons(initialIcons);
      console.log("Default icons added.");
    } else {
      console.log("Icons already exist. Skipping...");
    }

    let settings = await settingsService.getSettings();
    if (!settings) {
      initialSettings.colors = colors._id;
      initialSettings.icons = icons._id;
      await settingsService.createSettings(initialSettings);
      console.log("Default settings added.");
    } else {
      console.log("Settings already exist. Skipping...");
    }
  } catch (error) {
    console.error("Error while adding default values:", error);
  }
}

module.exports = seedDatabase;
