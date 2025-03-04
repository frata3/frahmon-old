const { Router } = require("express");
const userController = require("../controllers/user.account.controller");
const userProfileRouter = require("./user.profile.routes");
const userAccountRouter = require("./user.account.routes");
const userBlogRouter = require("./user.blog.routes");

const router = Router();
router.get("/", async (req, res, next) => {
    try {
      res.render("pages/user/main", {
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

router.post("/update-personal-info", userController.updatePersonalInfo);
router.post("/update-user-password", userController.updateUserPassword);

module.exports = router;
  