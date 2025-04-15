const { Router } = require("express");
const router = Router();
const userBlogController = require("../controllers/user.blog.controller");

router.get("/", userBlogController.getPostsByUser);
router.get("/new", userBlogController.createPostPage);
router.post("/new", userBlogController.createPost);

module.exports = router;
