import { Router } from 'express';
import userController from '../controllers/user.account.controller.js';
import userProfileRouter from './user.profile.routes.js';
import userAccountRouter from './user.account.routes.js';
import userBlogRouter from './user.blog.routes.js';
import userContentRouter from './user.content.routes.js';
import userUsersRouter from './user.users.routes.js';
import userConnectionRouter from './user.connection.routes.js';

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

export default router;
  