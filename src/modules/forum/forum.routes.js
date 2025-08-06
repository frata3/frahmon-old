import express from 'express';
const router = express.Router();
import forumController from './forum.controller.js';

router.get("/", forumController.getPosts);
// router.get("/paginated", forumController.getPaginated);
router.get("/create", forumController.createPostPage);
router.get("/:id", forumController.redirectToPost);
router.get("/:id/:slug", forumController.getPost);

router.post("/create", forumController.createPost);
router.post("/like", forumController.toggleLike);
router.post("/:postId/meta", forumController.getPostMeta);
router.delete("/:id", forumController.deletePost);

export default router;
