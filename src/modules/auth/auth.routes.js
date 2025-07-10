import { Router } from 'express';
import AuthController from './auth.controller.js';
const router = Router();

router.get("/register", AuthController.registerPage);
router.post("/register", AuthController.register);

router.get("/login", AuthController.loginPage);
router.post("/login", AuthController.login);

router.get("/logout", AuthController.logout);

export default router;
