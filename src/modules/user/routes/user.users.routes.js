const { Router } = require("express");
const router = Router({ mergeParams: true });
const userUsersController = require("../controllers/user.users.controller");

router.get("/", userUsersController.getUsersList);
// router.get("/posts", userPublicController.getUserPosts);

module.exports = router;
