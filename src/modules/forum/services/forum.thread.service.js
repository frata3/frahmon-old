const autoBind = require("auto-bind");
const { prisma } = require("../../../config/prisma.config");
// const { nanoid } = require('nanoid');
const generateSlug = require("../../../common/utils/slugify.util");
class ForumService {
  #prisma;
  constructor() {
    autoBind(this);
    this.#prisma = prisma;
  }

  async createPost({ title, content, userInfo }) {
    const { _id, username, fullname } = userInfo;
    const userExisting = await this.#prisma.user.findUnique({
      where: { id: _id },
    });
    if (!userExisting) {
      await this.#prisma.user.create({
        data: { id: _id, username, fullname },
      });
    }

    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    return await this.#prisma.post.create({
      data: { id: nanoid(10), title, slug, content, authorId: _id },
    });
  }

  async getAllPosts() {
    return await this.#prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullname: true,
          },
        },
      },
    });
  }
}

module.exports = new ForumService();
