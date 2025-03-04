const { Router } = require("express");
const router = Router();
const userBlogController = require("../controllers/user.blog.controller");
router.get("/", async (req, res, next) => {
    try {
      res.render("./pages/user/blog", {
        title: "ناحیه کاربری",
        user: req.session.user,
      });
    } catch (error) {
      next(error);
    }
});
router.get("/add", userBlogController.createPostPage);
router.post("/add", userBlogController.createPost);

module.exports = router;
