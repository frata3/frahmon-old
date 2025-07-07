const express = require("express");
const router = express.Router();
const forumController = require("../controllers/forum.thread.controller");

router.get("/", forumController.getPosts);
router.post("/create", forumController.createPost);
router.get("/create", forumController.createPostPage);
// router.get("/posts/:id/:slug", forumController.createPostPage);

module.exports = router;
