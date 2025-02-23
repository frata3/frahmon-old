const { Router } = require("express");
const SettingsModel = require("../settings/settings.model");
const posts = require("../post/post.model"); // ایمپورت مدل بلاگ
const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const settingsData = { 
      siteTitle: "عنوان سایت", 
      siteDescription: "توضیحات", 
      contactEmail: "info@example.com" 
    };

    const postData = { 
      titlePath: "first-post", 
      title: "اولین پست بلاگ", 
      description: "این اولین پست بلاگ است که برای تست اضافه شده.", 
      content: "این محتوا برای اولین پست بلاگ است. اینجا می‌توانید اطلاعات بیشتری قرار دهید.",
      thumbnail: "/images/first-post-thumbnail.jpg", 
      category: "تست", 
      tags: ["تست", "بلاگ", "اولین پست"], 
      author: "Admin", 
      isPublished: true,  
      publishDate: new Date(), 
      views: 0, 
    };
    
    const existingSettings = await SettingsModel.findOne();
    existingSettings 
      ? await SettingsModel.updateOne({}, settingsData) 
      : await SettingsModel.create(settingsData);

    const existingPosts = await posts.findOne();
    existingPosts 
      ? await posts.updateOne({}, postData) 
      : await posts.create(postData);

    res.send("تنظیمات و بلاگ مقداردهی شدند");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
