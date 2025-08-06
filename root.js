import express from "express";
import dotenv from "dotenv";
import expressEjsLayouts from "express-ejs-layouts";
import router from "./src/app.routes.js";
import { connectToDB as connectToForumDB } from "./src/config/prisma.config.js";
import session from "express-session";
import flash from "connect-flash";
import MongoStore from "connect-mongo";
import notFoundHandler from "./src/common/exception/not-found.handler.js";
import allExceptionHandler from "./src/common/exception/all-exception.handler.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import WeSocket from "./src/modules/we/socket/we.socket.js";

dotenv.config();

async function main() {
  await connectToForumDB();
  const app = express();
  const port = process.env.EXPRESS_PORT || 3000;
  const server = http.createServer(app);

  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_BLOG_URL }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  });

  app.use(sessionMiddleware);
  app.use(flash());

  const io = new SocketIOServer(server, {
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
  app.set("layout", "./layouts/main");

  app.use(router);

  notFoundHandler(app);
  allExceptionHandler(app);

  server.listen(port, () => {
    console.log(`server: http://localhost:${port}`);
  });
}

main();