const { Router } = require("express");
const postController = require("./post.controller");
const router = Router();


router.get("/", postController.showPosts);
router.get("/:titlePath", postController.getPost);

// router.get("/", (req, res, next) => {
//   res.render(`./pages/blog`, {
//       layout:"layouts/main",
//       title: "وبلاگ",
//       recentPosts: res.locals.posts,
//       pagination: res.locals.pagination,
//     });
//   });

module.exports = router;
