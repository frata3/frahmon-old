const { Router } = require("express");
const userController = require("../controllers/user.account.controller");
const userProfileRouter = require("./user.profile.routes");
const userAccountRouter = require("./user.account.routes");
const userBlogRouter = require("./user.blog.routes");
const userContentRouter = require("./user.content.routes");
const userUsersRouter = require("./user.users.routes");
const userConnectionRouter = require("./user.connection.routes");

const router = Router();
router.get("/", async (req, res, next) => {
    try {
      res.render("pages/user/me/main", {
        title: "ناحیه کاربری",
        user: req.session.user,
      });
    } catch (error) {
      next(error);
    }
});

router.use("/profile", userProfileRouter);
router.use("/blog", userBlogRouter); 
router.use("/account", userAccountRouter);
router.use("/content", userContentRouter); 
router.use("/users", userUsersRouter); 

router.post("/update-personal-info", userController.updatePersonalInfo);

module.exports = router;
  