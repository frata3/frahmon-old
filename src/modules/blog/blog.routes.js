import { Router } from 'express';
import postController from './blog.controller.js';
const router = Router();


router.get("/create", postController.createPostPage);
router.get("/", postController.showPosts);
router.get("/:id", postController.redirectToPost);
router.get("/:id/:slug", postController.getPost);

router.post("/create", postController.createPost);
router.delete("/:id", postController.deletePost);

export default router;
