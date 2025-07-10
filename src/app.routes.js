import { Router } from "express";
import userRoutes from "./modules/user/routes/user.routes.js";
import Authorization from "./common/guard/auth.guard.js";
import postRoutes from "./modules/post/post.routes.js";
import homeRoutes from "./modules/home/home.routes.js";
import weRoutes from "./modules/we/routes/we.routes.js";
import forumRoutes from "./modules/forum/routes/forum.routes.js";
import userPublicRoutes from "./modules/user/routes/user.public.routes.js";
import contentRoutes from "./modules/content/routes/content.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import setCurrentPath from "./common/middleware/setCurrentPath.js";
import settingsLoader from "./common/middleware/settings.js";
import settingsRoutes from "./modules/settings/routes/settings.routes.js";
import setAssets, { js, css } from "./common/middleware/setAssets.js";
import { graphqlHTTP } from "express-graphql";
import schema from "./graphQL/index.js";

const mainRouter = Router();

mainRouter.use(setCurrentPath);
mainRouter.use(settingsLoader);
mainRouter.use(settingsRoutes);
mainRouter.use((req, res, next) => {
  res.locals.user = req.session?.user || null;
  next();
})
mainRouter.use(
  setAssets({}),
  contentRoutes // ########################### routes ###########################
);

mainRouter.use("/graphql", graphqlHTTP({ schema, graphiql: true }));

mainRouter.use(
  "/auth",
  setAssets({
    css: [css("/assets/css/auth/style.css")],
    js: [],
  }),
  authRoutes // ########################### routes ###########################
);

mainRouter.use(
  "/me",
  setAssets({
    css: [css("/assets/css/user/account.css"),css("/assets/css/user/create-post.css")],
    js: [js("/scripts/account/scripts.js")],
  }),
  Authorization,
  userRoutes // ########################### routes ###########################
);

mainRouter.use(
  "/@:username",
  setAssets({
    css: [css("/assets/css/user/")],
    js: [js("/scripts/public/profile.js")],
  }),
  userPublicRoutes // ########################### routes ###########################
);

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
  weRoutes // ########################### routes ###########################
);

mainRouter.use(
  "/forum",
  setAssets({
    css: [css("/assets/css/forum/style.css")],
    js: [js("/scripts/forum/main.js")],
  }),
  forumRoutes // ########################### routes ###########################
);

mainRouter.use(
  "/blog",
  setAssets({
    css: [css("/assets/css/blog/style.css"),css("/assets/css/blog/post.css")],
    js: [js("/scripts/blog/scripts.js")],
  }),
  postRoutes // ########################### routes ###########################
);

mainRouter.use(
  "/",
  setAssets({}),
  homeRoutes // ########################### routes ###########################
);

export default mainRouter;
