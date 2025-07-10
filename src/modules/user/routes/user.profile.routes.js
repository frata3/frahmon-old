import { Router } from 'express';
import userController from '../controllers/user.account.controller.js';

const router = Router();

router.get("/", userController.personalInfoPage);

export default router;
  