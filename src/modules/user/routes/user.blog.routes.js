import { Router } from 'express';
const router = Router();
import userBlogController from '../controllers/user.blog.controller.js';

router.get("/", userBlogController.getPostsByUser);
router.get("/new", userBlogController.createPostPage);
router.post("/new", userBlogController.createPost);

export default router;
