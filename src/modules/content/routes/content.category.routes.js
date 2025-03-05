const { Router } = require("express");
const categoryController = require('../controllers/content.category.controller');
const topicRoutes = require('./content.topic.routes');
const router = Router();

// router.get('/', categoryController.getCategoryContent);
router.get("/:categorySlug", categoryController.getCategoryTopics);

router.use('/:categorySlug/topic', topicRoutes);

module.exports = router;
