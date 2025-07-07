const express = require("express");
const dotenv = require("dotenv");
const expressEjsLayouts = require("express-ejs-layouts");
const router = require("./src/app.routes");
const connectToMongoDB = require("./src/config/mongoose.config");
const { connectToDB: connectToForumDB } = require("./src/config/prisma.config");
// const { connectToDB: connectToShopDB } = require("./src/config/sequelize.config");
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const notFoundHandler = require("./src/common/exception/not-found.handler");
const allExceptionHandler = require("./src/common/exception/all-exception.handler");
const http = require("http");
const WeSocket = require("./src/modules/we/socket/we.socket");

dotenv.config();

async function main() {
  await connectToMongoDB();
  await connectToForumDB();
  // await connectToShopDB();
  const app = express();
  const port = process.env.PORT || 3000;
  const server = http.createServer(app);

  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  });

  app.use(sessionMiddleware);
  app.use(flash());

  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  app.set("io", io);

  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });
  const weSocket = new WeSocket(io);
  weSocket.init();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    if (req.path.startsWith("/assets/css/dynamic")) {
      return next();
    }
    express.static("public")(req, res, next);
  });

  app.set("view engine", "ejs");
  app.set("views", "./views");
  app.use(expressEjsLayouts);
  app.set("layout", "./layouts/default");

  app.use(router);

  notFoundHandler(app);
  allExceptionHandler(app);

  server.listen(port, () => {
    console.log(`server: http://localhost:${port}`);
  });
}

main();
