const { Router } = require("express");
const userController = require("../controllers/user.account.controller");

const router = Router();

router.post("/update-personal-info", userController.updatePersonalInfo);

module.exports = router;
  