const settingsService = require("../../modules/settings/services/settings.service");
// const contentService = require("../../modules/content/services/content.service");

const initialColors = {
  bodyBackgroundColor: "#121212",
  navBackgroundColor: "#1e1e1e",
  mainBackgroundColor: "#252525",
  containerBackgroundColor: "#1e1e1e",
  primaryColor: "#bb86fc",
  secondaryColor: "#03dac6",
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
      colors = await settingsService.createColors(initialColors);
      console.log("Default colors added.");
    } else {
      console.log("Colors already exist. Skipping...");
    }

    let icons = await settingsService.iconsFindOne();
    if (!icons) {
      icons = await settingsService.createIcons(initialIcons);
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
// async function seedInitialContent(categoryModel, topicModel, tagModel) {
//   const categoryCount = await categoryModel.countDocuments();
//   if (categoryCount > 0) {
//     console.log("Seed data already exists. Skipping seeding.");
//     return;
//   }

//   const categories = await categoryModel.insertMany([
//     { name: "AI", slug: "ai", description: "هوش مصنوعی" },
//     { name: "Web", slug: "web", description: "توسعه وب" },
//   ]);

//   const topics = await topicModel.insertMany([
//     {
//       name: "GPT",
//       slug: "gpt",
//       description: "مدل‌های زبانی",
//       categories: [categories[0]._id],
//     },
//     {
//       name: "React",
//       slug: "react",
//       description: "کتابخانه رابط کاربری",
//       categories: [categories[1]._id],
//     },
//   ]);

//   await tagModel.insertMany([
//     {
//       name: "tokens",
//       slug: "tokens",
//       topics: [topics[0]._id],
//     },
//     {
//       name: "hooks",
//       slug: "hooks",
//       topics: [topics[1]._id],
//     },
//   ]);

//   console.log("Seed content created successfully.");
// }

module.exports = seedDatabase;
