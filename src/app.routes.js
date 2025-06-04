const { Router } = require("express");
const postRoutes = require("./modules/post/post.routes");
const threadRoutes = require("./modules/thread/thread.routes");
const userRoutes = require("./modules/user/routes/user.routes.js");
const userPublicRoutes = require("./modules/user/routes/user.public.routes");
const Authorization = require("./common/guard/auth.guard");
const contentRoutes = require("./modules/content/routes/content.routes");
const authRoutes = require("./modules/auth/auth.routes");
const settingsLoader = require("./common/middleware/settings");
const settingsRoutes = require("./modules/settings/routes/settings.routes");
const setLayout = require("./common/middleware/setLayout");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphQL/index");
const appRouter = Router();

appRouter.use(settingsLoader);
appRouter.use(settingsRoutes);
appRouter.use(setLayout("layouts/main/main"), contentRoutes);
appRouter.use( "/graphql", graphqlHTTP({ schema, graphiql: true, }));

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
appRouter.use("/me", setLayout("layouts/user/main"), Authorization, userRoutes);
appRouter.use("/@:username", setLayout("layouts/main/main"), userPublicRoutes);
appRouter.get("/", setLayout("layouts/main/main"), async (req, res) => {
  res.render("./pages/home", {
    title: "صفحه اصلی",
    settings: res.locals.settings,
    user: req.session.user,
  });
});

appRouter.use("/blog", setLayout("layouts/main/main"), postRoutes);

module.exports = appRouter;
