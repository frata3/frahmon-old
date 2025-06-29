const { Router } = require("express");
const weController = require("../controllers/we.controller.js");

const router = Router();

router.get("/dm/:username", weController.getChatRoomPartial);

router.get("/", weController.chatHome);



module.exports = router;
