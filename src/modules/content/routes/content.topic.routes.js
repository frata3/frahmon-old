const { Router } = require("express");
const topicController = require('../controllers/content.topic.controller');
const tagRoutes = require('./content.tag.routes.js');
const router = Router();

// router.get("/:topicSlug", topicController.getTopicContent);

router.use("/:topicSlug/tag", tagRoutes);

module.exports = router;
