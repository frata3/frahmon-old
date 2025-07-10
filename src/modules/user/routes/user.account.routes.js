import { Router } from 'express';
import userController from '../controllers/user.account.controller.js';

const router = Router();

router.post("/update-personal-info", userController.updatePersonalInfo);

export default router;
  