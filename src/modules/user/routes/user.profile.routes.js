const { Router } = require("express");
const userController = require("../controllers/user.account.controller");

const router = Router();

router.get("/", userController.personalInfoPage);

module.exports = router;
  