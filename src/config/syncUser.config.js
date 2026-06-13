import { prisma } from "./prisma.config.js";
import sequelizeUserService from "../modules/market/services/market.user.service.js";
import blogService from "../modules/blog/blog.service.js";

async function syncUserToAllModules(user) {
  if (!user || !user._id) return;
  const userId = user._id.toString();

  /** -------- Prisma -------- */
  const forumExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!forumExists) {
    await prisma.user.create({
      data: {
        id: userId,
        username: user.username,
        fullname: user.fullname,
        avatar: user.avatar,
      },
    });
  } else {
    await prisma.user.update({
      where: { id: userId },
      data: {
        username: user.username,
        fullname: user.fullname,
        avatar: user.avatar,
      },
    });
  }

  /** -------- Sequelize -------- */
  await sequelizeUserService.createOrUpdateUser({
    id: userId,
    username: user.username,
    fullname: user.fullname,
    avatar: user.avatar,
  });

  /** -------- Blog Service -------- */
  await blogService.createOrUpdateUser({
    _id: userId,
    username: user.username,
    fullname: user.fullname,
    avatar: user.avatar,
  });
}

export default syncUserToAllModules;