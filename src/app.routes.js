const { Router } = require("express");
const postRoutes = require("./modules/post/post.routes");
const userRoutes = require("./modules/user/routes/user.routes.js");
const chatRoutes = require("./modules/chat/chat.routes.js");
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
appRouter.use("/graphql", graphqlHTTP({ schema, graphiql: true }));
appRouter.use("/auth", setLayout("layouts/main/main"), authRoutes);
appRouter.use("/me", setLayout("layouts/main/main"), Authorization, userRoutes);
appRouter.use("/@:username", setLayout("layouts/main/main"), userPublicRoutes);
appRouter.use("/chat", setLayout("layouts/chat/main"), Authorization, chatRoutes);
appRouter.use("/blog", setLayout("layouts/main/main"), postRoutes);
appRouter.get("/", setLayout("layouts/main/main"), async (req, res) => {
  res.render("./pages/home", {
    title: "صفحه اصلی",
    settings: res.locals.settings,
    user: req.session.user,
  });
});


module.exports = appRouter;
