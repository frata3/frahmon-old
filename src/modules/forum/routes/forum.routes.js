import express from 'express';
const router = express.Router();
import forumController from '../controllers/forum.thread.controller.js';

router.post("/create", forumController.createPost);
router.post("/like", forumController.toggleLike);
router.delete("/:id", forumController.deletePost);
  
router.get("/", forumController.getPosts);
router.get("/paginated", forumController.getPaginated);
router.get("/create", forumController.createPostPage);
router.get("/:id", forumController.redirectToPost);
router.get("/:id/:slug", forumController.getPost);
router.post("/:postId/meta", forumController.getPostMeta);

export default router;
