const { Router } = require("express");
const postController = require("./post.controller");
const router = Router();


router.get("/", postController.showPosts);
router.get("/post/:slug", postController.getPost);

module.exports = router;
