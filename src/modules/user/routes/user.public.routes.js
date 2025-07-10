import { Router } from 'express';
const router = Router({ mergeParams: true });
import userPublicController from '../controllers/user.public.controller.js';

router.get("/", userPublicController.getUserProfile);
router.get("/posts", userPublicController.getUserPosts);

export default router;
