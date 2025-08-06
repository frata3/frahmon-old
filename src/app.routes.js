import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import { graphqlHTTP } from "express-graphql";
import schema from "./graphQL/index.js";
import userRoutes from "./modules/user/routes/user.routes.js";
import Authorization from "./common/guard/auth.guard.js";
import postRoutes from "./modules/blog/blog.routes.js";
import homeRoutes from "./modules/home/home.routes.js";
import weRoutes from "./modules/we/routes/we.routes.js";
import forumRoutes from "./modules/forum/forum.routes.js";
import userPublicRoutes from "./modules/user/routes/user.public.routes.js";
import setCurrentPath from "./common/middleware/setCurrentPath.js";
// import contentRoutes from "./modules/content/routes/content.routes.js";
import settingsLoader from "./common/middleware/settings.js";
import settingsRoutes from "./modules/settings/routes/settings.routes.js";
import setAssets, { js, css } from "./common/middleware/setAssets.js";
import { addAssetsSupport } from "./common/middleware/addAssetsSupport.js";
import { registerJalaliHelpers } from "./common/utils/jDate.js";

const mainRouter = Router();

mainRouter.use(setCurrentPath);
// mainRouter.use(settingsLoader);
// mainRouter.use(settingsRoutes);
mainRouter.use(addAssetsSupport);
mainRouter.use(registerJalaliHelpers);
mainRouter.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.cssFiles = [];
  res.locals.jsFiles = [];
  next();
});
 
// mainRouter.use(contentRoutes);
mainRouter.use("/", homeRoutes);
mainRouter.use("/auth", authRoutes);
mainRouter.use("/graphql", graphqlHTTP({ schema, graphiql: true }));
mainRouter.use("/me", Authorization, userRoutes);
mainRouter.use("/forum", forumRoutes);
mainRouter.use("/blog", postRoutes);
mainRouter.use("/@:username", userPublicRoutes);

mainRouter.use(
  "/we",
  setAssets({
    css: [css("/assets/css/we/style.css")],
    js: [
      js("/socket.io/socket.io.js"),
      js("/scripts/we/index.js", { type: "module", defer: true }),
      js("/scripts/we/socket.js", { type: "module", defer: true }),
    ],
  }),
  Authorization,
  weRoutes
);

export default mainRouter;
