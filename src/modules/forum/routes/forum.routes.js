import express from 'express';
const router = express.Router();
import forumController from '../controllers/forum.thread.controller.js';

router.get("/", forumController.getPosts);
router.post("/create", forumController.createPost);
router.post("/like", forumController.toggleLike);
router.get("/create", forumController.createPostPage);
router.get("/:id/:slug", forumController.getPost);

export default router;
