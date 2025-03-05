const { Router } = require("express");
const postRoutes = require("./modules/post/post.routes");
const userRoutes = require("./modules/user/routes/user.routes");
const Authorization = require("./common/guard/auth.guard");
const contentRoutes = require("./modules/content/routes/content.main.routes");
const authRoutes = require("./modules/auth/auth.routes");
const settingsLoader = require("./common/middleware/settings");
const settingsRoutes = require("./modules/settings/routes/settings.routes");
const setLayout = require("./common/middleware/setLayout");
const mainRouter = Router();

mainRouter.use(settingsLoader);
mainRouter.use(settingsRoutes);

mainRouter.get("/", setLayout("layouts/main/main"), async (req, res) => {
  res.render("./pages/home", {
    title: "صفحه اصلی",
    settings: res.locals.settings,
    user: req.session.user,
  });
});
mainRouter.use("/explore", setLayout("layouts/main/main"), contentRoutes);

mainRouter.use("/blog", setLayout("layouts/main/main"), postRoutes);
mainRouter.use("/user", setLayout("layouts/user/main"), Authorization, userRoutes);
mainRouter.use("/auth", setLayout("layouts/main"), authRoutes);

module.exports = mainRouter;
