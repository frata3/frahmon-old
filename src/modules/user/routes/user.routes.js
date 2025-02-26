const { Router } = require("express");
const UserController = require("../controllers/user.controller");
const Authorization = require("../../../common/guard/auth.guard");

const router = Router();
router.use(Authorization);
router.get("/", UserController.nestMainPage);
router.get("/personal-info", UserController.personalInfoPage);
router.post("/update-personal-info", UserController.updatePersonalInfo);
router.post("/update-user-password", UserController.updateUserPassword);

module.exports = router;
 