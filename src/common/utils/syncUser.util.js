import  {prisma}  from '../../config/prisma.config.js';

async function syncUserToAllModules(user) {
  if (!user || !user._id) return;
  const userId = user._id.toString();
  const exists = await prisma.user.findUnique({ where: { id: userId } });

  if (!exists) {
    await prisma.user.create({
      data: {
        id: userId,
        username: user.username,
        fullname: user.fullname,
      },
    });
  } else {
    await prisma.user.update({
      where: { id: userId },
      data: {
        username: user.username,
        fullname: user.fullname,
      },
    });
  }
}

export default  syncUserToAllModules ;
