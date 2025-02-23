const { Router } = require("express");
// const authRoutes = require("./modules/auth/auth.routes");
// const forumRoutes = require("./modules/forum/forum.routes");
const postRoutes = require("./modules/post/post.routes");
// const marketplaceRoutes = require("./modules/marketplace/marketplace.routes");
// const legalEntityRoutes = require("./modules/legal/legal.routes");
// const Authorization = require("./common/guard/authorization.guard");
const settingsLoader = require("./common/middleware/settings");
const homeController = require("./modules/home/home.controller");
const seedRoutes = require("./modules/seed/seed.routes");
const mainRouter = Router();

mainRouter.use(settingsLoader);
mainRouter.use("/seed", seedRoutes);

const setDefaultLayout = (layoutPath) => (req, res, next) => {
  req.app.set("layout", layoutPath);
  next();
};

mainRouter.get("/", setDefaultLayout("layouts/main"), homeController.index);

mainRouter.use("/blog", setDefaultLayout("layouts/main"), postRoutes);

// mainRouter.use("/panel", setDefaultLayout("layouts/panel/main"), Authorization, (req, res, next) => {
//   try {
//     res.render("pages/panel/index", { user: req.session.user });
//   } catch (error) {
//     next(error);
//   }
// });

// mainRouter.use(websiteSettings);

// mainRouter.use("/auth", setDefaultLayout("layouts/auth/main"), authRoutes);
// mainRouter.use("/forum", forumRoutes);
// mainRouter.use("/marketplace", marketplaceRoutes);
// mainRouter.use("/legal", legalEntityRoutes);

module.exports = mainRouter;
