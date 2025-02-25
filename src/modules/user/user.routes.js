const { Router } = require("express");
const UserController = require("./user.controller");
const Authorization = require("../../common/guard/auth.guard");

const router = Router();
router.use(Authorization);


module.exports = router;
 