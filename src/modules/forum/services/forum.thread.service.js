import autoBind from "auto-bind";
import { prisma } from "../../../config/prisma.config.js";
import generateSlug from "../../../common/utils/slugify.util.js";

class ForumService {
  #prisma;
  constructor() {
    autoBind(this);
    this.#prisma = prisma;
  }

  async createPost({ id, title, content, userId, parentId, quoteId, repostId }) {
    let slug = null;
  
    if (title) {
      const baseSlug = generateSlug(title);
      slug = baseSlug;
      let counter = 1;
      while (await this.#prisma.post.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter++}`;
      }
    }
  
    const newPost = await this.#prisma.post.create({
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
  
    if (parentId && !quoteId && !repostId) {
      await this.#prisma.post.update({
        where: { id: parentId },
        data: {
          replyCount: { increment: 1 },
        },
      });
    }
  
    return newPost;
  }
  

  async getPaginatedPosts({ cursor }, userId) {
    const take = 6;
    const where = { parentId: null };
    if (cursor) where.id = { lt: cursor };

    const posts = await this.#prisma.post.findMany({
      take,
      where,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, username: true, fullname: true },
        },
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
        likes: { select: { userId: true } },
      },
    });

    const postsWithReplies = await Promise.all(
      posts.map(async (post) => {
        const bestReplies = await this.#prisma.post.findMany({
          where: { parentId: post.id },
          orderBy: [{ likes: { _count: "desc" } }, { createdAt: "asc" }],
          include: {
            author: { select: { id: true, username: true, fullname: true } },
            likes: { select: { userId: true } },
          },
          take: 2,
        });

        const isLiked = userId
          ? post.likes.some((like) => like.userId === userId)
          : false;

        return {
          ...post,
          isLiked,
          likeCount: post.likes.length,
          bestReplies: bestReplies.map((r) => ({
            ...r,
            isLiked: userId
              ? r.likes.some((like) => like.userId === userId)
              : false,
            likeCount: r.likes.length,
          })),
        };
      })
    );

    return postsWithReplies;
  }

  async getPost(id, userId) {
    const post = await this.#prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, fullname: true, username: true } },
        parent: {
          include: {
            author: { select: { id: true, fullname: true, username: true } },
          },
        },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            author: { select: { id: true, fullname: true, username: true } },
            likes: { select: { userId: true } },
          },
        },
        likes: userId ? { where: { userId } } : false,
      },
    });
  
    if (!post) return null;
  
    post.isOwner = !!userId && post.author.id.toString() === userId.toString();
    post.isLiked = userId ? post.likes.length > 0 : false;
    delete post.likes;
  
    if (post.parent && post.parent.author) {
      post.parent.isOwner =
        !!userId &&
        post.parent.author.id.toString() === userId.toString();
    }
  
    post.replies = post.replies.map((reply) => {
      const isOwner = !!userId && reply.author.id.toString() === userId.toString();
      const isLiked = userId
        ? reply.likes.some((like) => like.userId === userId)
        : false;
  
      return {
        ...reply,
        isOwner,
        isLiked,
        likeCount: reply.likes.length,
      };
    });
  
    return post;
  }
  
  async getById(id) {
    return await this.#prisma.post.findUnique({
      where: { id },
      select: { id: true, authorId: true },
    });
  }
  async deleteById(id) {
    return await this.#prisma.post.delete({ where: { id } });
  }
  async getPostMeta(postId) {
    return await prisma.post.findUnique({
      where: { id: postId },
      select: {
        content: true,
        author: {
          select: {
            fullname: true,
            username: true,
          },
        },
      },
    });
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
        where: { postId_userId: { postId, userId } },
      });
      await this.#prisma.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
      });
      return { liked: false };
    } else {
      await this.#prisma.like.create({
        data: { postId, userId },
      });
      await this.#prisma.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
      });
      return { liked: true };
    }
  }
}

export default new ForumService();
