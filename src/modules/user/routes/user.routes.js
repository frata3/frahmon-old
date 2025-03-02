const { Router } = require("express");
const UserController = require("../controllers/user.controller");
const Authorization = require("../../../common/guard/auth.guard");

const router = Router();
router.use(Authorization);
router.get("/", UserController.nestMainPage);
router.get("/personal-info", UserController.personalInfoPage);
router.post("/update-personal-info", UserController.updatePersonalInfo);
router.post("/update-user-password", UserController.updateUserPassword);

router.get("/blog/create-post", UserController.createPostPage);
router.post("/blog/create-post", UserController.createPost);

router.get("/store/add-item", UserController.createPostPage);
router.post("/store/add-item", UserController.createPost);

module.exports = router;
 