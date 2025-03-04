const { Router } = require("express");
const userController = require("../controllers/user.account.controller");

const router = Router();

router.get("/", userController.personalInfoPage);

router.post("/update-personal-info", userController.updatePersonalInfo);
router.post("/update-user-password", userController.updateUserPassword);

module.exports = router;
  