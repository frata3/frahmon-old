const { Router } = require("express");
const router = Router();

router.get("/assets/css/dynamic/:file", async (req, res) => {
    try {
      res.set("Content-Type", "text/css");
      res.render(`./css/${req.params.file}.ejs`, {
        settings: res.locals.settings,
        layout: false
       });
    } catch (error) {
      console.log("خطا در تولید فایل CSS:", error);
      res.status(500).send("خطا در پردازش فایل CSS");
    }
  });

module.exports = router;