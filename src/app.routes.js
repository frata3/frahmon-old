const { Router } = require("express");
const postRoutes = require("./modules/post/post.routes");
const threadRoutes = require("./modules/thread/thread.routes");
const meRoutes = require("./modules/user/routes/user.routes");
const userRoutes = require("./modules/user/routes/user.routes");
const Authorization = require("./common/guard/auth.guard");
const contentRoutes = require("./modules/content/routes/content.routes");
const authRoutes = require("./modules/auth/auth.routes");
const settingsLoader = require("./common/middleware/settings");
const settingsRoutes = require("./modules/settings/routes/settings.routes");
const setLayout = require("./common/middleware/setLayout");
const appRouter = Router();

appRouter.use(settingsLoader);
appRouter.use(settingsRoutes);
appRouter.use(setLayout("layouts/main/main"), contentRoutes);

// mainRouter.use((req, res, next) => {
//   if (req.method === 'GET') {
//     const _render = res.render;
//     res.render = (view, options = {}, callback) => {
//       const defaultData = {
//         settings: res.locals.settings,
//         user: req.session.user
//       };
//       return _render.call(this, view, { ...defaultData, ...options }, callback);
//     };
//   }
//   next();
// });
appRouter.use("/auth", setLayout("layouts/main/main"), authRoutes);
appRouter.use("/me", setLayout("layouts/me/main"), Authorization, meRoutes);
appRouter.use("/@:username", setLayout("pages/me/main"), userRoutes);

appRouter.get("/", setLayout("layouts/main/main"), async (req, res) => {
  res.render("./pages/home", {
    title: "صفحه اصلی",
    settings: res.locals.settings,
    user: req.session.user,
  });
});

appRouter.use("/blog", setLayout("layouts/main/main"), postRoutes);

module.exports = appRouter;
 