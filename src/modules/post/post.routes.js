import { Router } from 'express';
import postController from './post.controller.js';
const router = Router();


router.get("/", postController.showPosts);
router.get("/post/:slug", postController.getPost);

export default router;
