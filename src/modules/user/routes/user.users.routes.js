import { Router } from 'express';
const router = Router({ mergeParams: true });
import userUsersController from '../controllers/user.users.controller.js';

router.get("/", userUsersController.getUsersList);

// router.get("/posts", userPublicController.getUserPosts);

export default router;
