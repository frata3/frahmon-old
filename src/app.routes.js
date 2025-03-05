const { Router } = require("express");
const postRoutes = require("./modules/post/post.routes");
const userRoutes = require("./modules/user/routes/user.routes");
const Authorization = require("./common/guard/auth.guard");
const authRoutes = require("./modules/auth/auth.routes");
const settingsLoader = require("./common/middleware/settings");
const setLayout = require("./common/middleware/setLayout");
const mainRouter = Router();

mainRouter.use(settingsLoader);

mainRouter.get("/assets/css/dynamic/:file", async (req, res) => {
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


mainRouter.get("/", setLayout("layouts/main/main"), async (req, res) => {
  res.render("./pages/home", {
    title: "صفحه اصلی",
    settings: res.locals.settings,
    cssFile: "/assets/css/home/style.css",
    user: req.session.user,
  });
});

mainRouter.use("/blog", setLayout("layouts/main/main"), postRoutes);

mainRouter.use(
  "/user",
  setLayout("layouts/user/main"),
  Authorization,
  userRoutes
);

mainRouter.use("/auth", setLayout("layouts/main"), authRoutes);

module.exports = mainRouter;
