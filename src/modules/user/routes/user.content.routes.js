const { Router } = require("express");
const router = Router();
const userContentController = require("../controllers/user.content.controller");
const seedContent = require("../../content/services/content.service");

router.get("/", userContentController.getContentPage);
router.get('/create', userContentController.renderCreateContentForm);
router.post('/category', userContentController.createCategory);
router.post('/topic', userContentController.createTopic);
router.post('/tag', userContentController.createTag);

router.get("/contentseed", async (req, res) => {
    console.log("seed run shod");
    await seedContent.seedInitialContent();
  });
module.exports = router;
