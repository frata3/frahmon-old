const { Router } = require("express");
const router = Router({ mergeParams: true });
const userPublicController = require("../controllers/user.public.controller");

router.get("/", userPublicController.getUserProfile);
router.get("/posts", userPublicController.getUserPosts);
module.exports = router;
