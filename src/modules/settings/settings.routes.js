const { Router } = require("express");
const { getSettings } = require("./settings.controller");

const router = Router();

router.get("/", getSettings.findConfigs);

module.exports = router;
