import { Router } from 'express';
const router = Router();
import userContentController from '../controllers/user.content.controller.js';
import seedContent from '../../content/services/content.service.js';

router.get("/", userContentController.getContentPage);
router.get('/create', userContentController.renderCreateContentForm);
router.post('/category', userContentController.createCategory);
router.post('/topic', userContentController.createTopic);
router.post('/tag', userContentController.createTag);

router.get("/contentseed", async (req, res) => {
    console.log("seed run shod");
    await seedContent.seedInitialContent();
  });
export default router;
