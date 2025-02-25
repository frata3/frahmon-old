const { Router } = require("express");
// const forumRoutes = require("./modules/forum/forum.routes");
// const marketplaceRoutes = require("./modules/marketplace/marketplace.routes");
// const legalEntityRoutes = require("./modules/legal/legal.routes");
const postRoutes = require("./modules/post/post.routes");
const userRoutes = require("./modules/user/user.routes");
const Authorization = require("./common/guard/auth.guard");
const authRoutes = require("./modules/auth/auth.routes");
const settingsLoader = require("./common/middleware/settings");
const homeController = require("./modules/home/home.controller");
const seedRoutes = require("./modules/seed/seed.routes");
const mainRouter = Router();

mainRouter.use(settingsLoader);
mainRouter.use("/seed", seedRoutes);

const setDefaultLayout = (layoutPath,cssFile) => (req, res, next) => {
  req.app.set("layout", layoutPath);
  res.locals.cssFile = cssFile;
  next();
};

mainRouter.get("/", setDefaultLayout("layouts/main","/home/style.css"), homeController.index);

mainRouter.use("/blog", setDefaultLayout("layouts/main"), postRoutes);

mainRouter.use("/nest", setDefaultLayout("layouts/main", "/auth/style.css"), Authorization, userRoutes);

mainRouter.use("/auth", setDefaultLayout("layouts/main", "/auth/style.css"), authRoutes);

// mainRouter.use("/panel", setDefaultLayout("layouts/panel/main"), Authorization, (req, res, next) => {
//   try {
//     res.render("pages/panel/index", { user: req.session.user });
//   } catch (error) {
//     next(error);
//   }
// });

// mainRouter.use(websiteSettings);

// mainRouter.use("/forum", forumRoutes);
// mainRouter.use("/marketplace", marketplaceRoutes);
// mainRouter.use("/legal", legalEntityRoutes);

module.exports = mainRouter;
