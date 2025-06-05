const { Router } = require("express");
const contentController = require("../controllers/content.controller");
const router = Router();

router.get("/explore", contentController.getExplore);
router.get("/category/:categorySlug", contentController.getCategory);
router.get("/topic/:topicSlug", contentController.getTopic);
router.get("/tag/:tagSlug", contentController.getTagContents);

router.get("/categories/search", contentController.searchCategories)
router.get("/topics/search", contentController.searchTopics)
router.get("/tags/search", contentController.searchTags)
  

module.exports = router;
  