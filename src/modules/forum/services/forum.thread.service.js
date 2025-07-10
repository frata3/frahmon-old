import autoBind from "auto-bind";
import { prisma } from "../../../config/prisma.config.js";
import generateSlug from "../../../common/utils/slugify.util.js";

class ForumService {
  #prisma;
  constructor() {
    autoBind(this);
    this.#prisma = prisma;
  }

  async createPost({
    id,
    title,
    content,
    userId,
    parentId,
    quoteId,
    repostId,
  }) {
    let slug = null;
    if (title) {
      const baseSlug = generateSlug(title);
      slug = baseSlug;
      let counter = 1;
      while (await this.#prisma.post.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter++}`;
      }
    }

    return await this.#prisma.post.create({
      data: {
        id,
        title,
        slug,
        content,
        authorId: userId,
        parentId,
        quoteId,
        repostId,
      },
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

  async getAllPosts() {
    const posts = await this.#prisma.post.findMany({
      where: {
        parentId: null,
      },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullname: true,
          },
        },
        quote: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                fullname: true,
              },
            },
          },
        },
        repost: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                fullname: true,
              },
            },
          },
        },
        likes: true,
      },
    });
  
    return posts.map(post => ({
      ...post,
      likeCount: post.likes.length,
    }));
  }
  

  async getPost(id) {
    const post = await this.#prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true, fullname: true } },
        quote: {
          include: {
            author: { select: { id: true, username: true, fullname: true } },
          },
        },
        repost: {
          include: {
            author: { select: { id: true, username: true, fullname: true } },
          },
        },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            author: { select: { id: true, username: true, fullname: true } },
            likes: true,
          },
        },
        likes: true,
      },
    });

    return {
      ...post,
      likeCount: post.likes.length,
      replies: post.replies.map((r) => ({
        ...r,
        likeCount: r.likes.length,
      })),
    };
  }

  async toggleLike(postId, userId) {
    const existing = await this.#prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });
  
    if (existing) {
      await this.#prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
      return { liked: false };
    } else {
      await this.#prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
      return { liked: true };
    }
  }
  
}

export default new ForumService();
