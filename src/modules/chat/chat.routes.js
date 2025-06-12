const { Router } = require("express");
const chatController = require("./chat.controller");

const router = Router();

router.get("/:username", chatController.getChatRoomPartial);
router.post("/create", chatController.createPrivateChatIfNotExist);
router.get("/", chatController.chatHome);



module.exports = router;
