import { Router } from 'express';
import contentController from '../controllers/content.controller.js';
const router = Router();

router.get("/explore", contentController.getExplore);
router.get("/category/:categorySlug", contentController.getCategory);
router.get("/topic/:topicSlug", contentController.getTopic);
router.get("/tag/:tagSlug", contentController.getTagContents);

router.get("/categories/search", contentController.searchCategories)
router.get("/topics/search", contentController.searchTopics)
router.get("/tags/search", contentController.searchTags)


export default router;
  