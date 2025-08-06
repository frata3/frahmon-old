import { Router } from 'express';
import userController from '../controllers/user.controller.js'
import userContentRouter from './user.content.routes.js';

const router = Router();

router.get("/", userController.userMainPage);
router.get("/posts/blog", userController.getUserBlogPosts);
router.get("/posts/forum", userController.getUserForumPosts);

router.get("/account", userController.personalInfoPage);
router.get("/users", userController.getUsersList);

router.post("/update-personal-info", userController.updatePersonalInfo);
router.use("/content", userContentRouter);

export default router;
  