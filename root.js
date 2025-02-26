const express = require("express");
const dotenv = require("dotenv");
const expressEjsLayouts = require("express-ejs-layouts");
const mainRouter = require("./src/app.routes");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const notFoundHandler = require("./src/common/exception/not-found.handler");
const allExceptionHandler = require("./src/common/exception/all-exception.handler");
dotenv.config();

async function main() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 روز
      },
    })
  );

  require("./src/config/mongoose.config");

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
    app.use(express.static("public"));
    app.set("view engine", "ejs");
  app.set("views", "./views");
  app.use(expressEjsLayouts);

  app.set("layout", "./layouts/default"); 

  app.use(mainRouter);
  notFoundHandler(app);
  allExceptionHandler(app);
  app.listen(port, () => {
    console.log(`server: http://localhost:${port}`);
  });
}

main();