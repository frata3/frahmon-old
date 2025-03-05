const settingsService = require("../../modules/settings/services/settings.service");
const contentService = require("../../modules/content/services/content.service");

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

const categories = [
  { name: "فناوری", slug: "tech" },
  { name: "ورزش", slug: "sports" },
  { name: "سلامت", slug: "health" },
  { name: "کسب‌وکار", slug: "business" },
  { name: "هنر", slug: "art" },
  { name: "موسیقی", slug: "music" },
  { name: "سینما", slug: "cinema" },
  { name: "مسافرت", slug: "travel" },
  { name: "تاریخ", slug: "history" },
  { name: "غذا", slug: "food" },
  { name: "کتاب", slug: "books" },
  { name: "بازی‌های ویدیویی", slug: "gaming" },
  { name: "علم", slug: "science" },
  { name: "مد و فشن", slug: "fashion" },
  { name: "روانشناسی", slug: "psychology" },
  { name: "توسعه فردی", slug: "self-improvement" },
  { name: "محیط زیست", slug: "environment" },
  { name: "ماشین‌ها", slug: "cars" },
  { name: "حیوانات", slug: "animals" },
  { name: "فضا", slug: "space" },
];

const topicsByCategory = {
  tech: ["موبایل", "هوش مصنوعی", "لپ‌تاپ", "بازی‌های ویدیویی", "امنیت سایبری"],
  sports: ["فوتبال", "بسکتبال", "والیبال", "فرمول 1", "بدنسازی"],
  health: ["تغذیه", "سلامت روان", "تمرینات ورزشی", "بیماری‌ها", "داروها"],
  business: ["استارتاپ", "بازاریابی", "سرمایه‌گذاری", "مدیریت", "اقتصاد"],
  music: ["پاپ", "راک", "هیپ‌هاپ", "موسیقی سنتی", "سازها"],
  cinema: [
    "فیلم‌های اکشن",
    "فیلم‌های کمدی",
    "سریال‌ها",
    "کارگردان‌ها",
    "بازیگران",
  ],
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

    let existingCategories = await contentService.findCategories({});
    if (existingCategories.length > 0) {
      console.log("categories already exist. Skipping...");
    } else {
      for (let categoryData of categories) {
        const category = await contentService.createCategories(categoryData);
        let topicNames = topicsByCategory[category.slug] || [
          "موضوع ۱",
          "موضوع ۲",
          "موضوع ۳",
          "موضوع ۴",
          "موضوع ۵",
        ];
        let topicCount = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < topicCount; i++) {
          await contentService.createTopics({
            name: topicNames[i] || `موضوع ${i + 1}`,
            slug: `${category.slug}-topic-${i + 1}`,
            category: category._id,
          });
        }
      }
      console.log("Default categories and topics added.");
    }
  } catch (error) {
    console.error("Error while adding default values:", error);
  }
}

module.exports = seedDatabase;
