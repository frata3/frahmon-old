const { Router } = require("express");
const userRoutes = require("./modules/user/routes/user.routes.js");
const Authorization = require("./common/guard/auth.guard");
const postRoutes = require("./modules/post/post.routes");
const weRoutes = require("./modules/we/routes/we.routes.js");
const forumRoutes = require("./modules/forum/routes/forum.routes")
const userPublicRoutes = require("./modules/user/routes/user.public.routes");
const contentRoutes = require("./modules/content/routes/content.routes");
const authRoutes = require("./modules/auth/auth.routes");
const setLayoutContext = require("./common/middleware/setLayoutContext")
const settingsLoader = require("./common/middleware/settings");
const settingsRoutes = require("./modules/settings/routes/settings.routes");
const setLayout = require("./common/middleware/setLayout");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphQL/index");
const rooter = Router();

rooter.use(setLayoutContext);
rooter.use(settingsLoader);
rooter.use(settingsRoutes);
rooter.use(setLayout("layouts/main/main"), contentRoutes);
rooter.use("/graphql", graphqlHTTP({ schema, graphiql: true }));
rooter.use("/auth", setLayout("layouts/main/main"), authRoutes);
rooter.use("/me", setLayout("layouts/main/main"), Authorization, userRoutes);
rooter.use("/@:username", setLayout("layouts/main/main"), userPublicRoutes);
rooter.use("/we", setLayout("layouts/we/main"), Authorization, weRoutes);
rooter.use("/forum", setLayout("layouts/main/main"), forumRoutes);
rooter.use("/blog", setLayout("layouts/main/main"), postRoutes);
rooter.get("/", setLayout("layouts/main/main"), async (req, res) => {
  res.render("./pages/home", {
    title: "صفحه اصلی",
    settings: res.locals.settings,
    user: req.session.user,
  });
});


module.exports = rooter;
