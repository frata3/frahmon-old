const { Router } = require("express");
const AuthController = require("./auth.controller");
const router = Router();

router.get("/register", AuthController.registerPage);
router.post("/register", AuthController.register);

router.get("/login", AuthController.loginPage);
router.post("/login", AuthController.login);

router.get("/logout", AuthController.logout);

module.exports = router;
