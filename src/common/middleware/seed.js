const settingsService = require("../../modules/settings/services/settings.service");
const contentService = require("../../modules/content/services/content.service");

const initialColors = {
  bodyBackgroundColor: "#121212",
  navBackgroundColor: "#1e1e1e",
  mainBackgroundColor: "#252525",
  containerBackgroundColor: "#1e1e1e",
  primaryColor: "#bb86fc",
  secondaryColor: "#03dac6"
}



const initialIcons = {
  icon: "./",
  favicon: "./",
};

const initialSettings = {
  colors: null,
  icons: null,
};

const defaultCategories = [
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

const tags = [
  { name: "iPhone_16", slug: "iphone-16" },
  { name: "Galaxy_S24", slug: "galaxy-s24" },
  { name: "Xiaomi_14", slug: "xiaomi-14" },
  { name: "RTX_5090", slug: "rtx-5090" },
  { name: "Intel_i9_14900K", slug: "intel-i9-14900k" },
  { name: "ChatGPT", slug: "chatgpt" },
  { name: "Stable_Diffusion", slug: "stable-diffusion" },
  { name: "Messi", slug: "messi" },
  { name: "Mbappe", slug: "mbappe" },
  { name: "Real_Madrid", slug: "real-madrid" },
  { name: "ویتامین_D", slug: "vitamin-d" },
  { name: "رژیم_کتوژنیک", slug: "keto-diet" },
  { name: "یوگا", slug: "yoga" },
  { name: "مدیتیشن", slug: "meditation" },
  { name: "Bitcoin", slug: "bitcoin" },
  { name: "Ethereum", slug: "ethereum" },
  { name: "Pen", slug: "pen" },
  { name: "Procreate", slug: "procreate" },
  { name: "Taylor_Swift", slug: "taylor-swift" },
  { name: "Weeknd", slug: "weeknd" },
  { name: "Oppenheimer", slug: "oppenheimer" },
  { name: "Barbie", slug: "barbie" },
  { name: "پاریس", slug: "paris" },
  { name: "توکیو", slug: "tokyo" },
];

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

    let existingCategories = await contentService.findCategories({});
    if (existingCategories.length > 0) {
      console.log("Categories already exist. Skipping...");
    } else {
      for (let categoryData of defaultCategories) {
        await contentService.createCategories(categoryData);
      }
      console.log("Categories added.");
    }

    let categories = await contentService.findCategories({});
    let existingTopics = await contentService.findTags({});
    if (existingTopics.length > 0) {
      console.log("Topics already exist. Skipping...");
    } else {
      for (let category of categories) {
        let topicNames = topicsByCategory[category.slug] || [
          "موضوع ۱",
          "موضوع ۲",
          "موضوع ۳",
          "موضوع ۴",
          "موضوع ۵",
        ];
        let count = Math.floor(Math.random() * 3) + 7;
        for (let i = 0; i < count; i++) {
          let topicName = topicNames[i] || `موضوع ${i + 1}`;
          let topicSlug = `${category.slug}-topic-${i + 1}`;
          let existingTopic = await contentService.findTopics({
            name: topicName,
          });
          if (!existingTopic.length) {
            await contentService.createTopics({
              name: topicName,
              slug: topicSlug,
              category: category._id,
            });
          }
        }
      }
      console.log("Topics added.");
    }

    let topics = await contentService.findTopics({});
    let existingTags = await contentService.findTags({});
    if (existingTags.length > 0) {
      console.log("Tags already exist. Skipping...");
    } else {
      for (let topic of topics) {
        let count = Math.floor(Math.random() * 3) + 7;
        for (let i = 0; i < count; i++) {
          let tagIndex = Math.floor(Math.random() * tags.length);
          let tagData = tags[tagIndex];
          let tagName = tagData.name;
          let tagSlug = `${tagData.slug}-${Math.floor(Math.random() * 10000)}`;
          await contentService.createTags({
            name: tagName,
            slug: tagSlug,
            topic: topic._id,
          });
        }
      }
      console.log("Tags added.");
    }
  } catch (error) {
    console.error("Error while adding default values:", error);
  }
}

module.exports = seedDatabase;