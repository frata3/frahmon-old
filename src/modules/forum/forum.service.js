import autoBind from "auto-bind";
import { prisma } from "../../config/prisma.config.js";

class ForumService {
  #prisma;
  constructor() {
    autoBind(this);
    this.#prisma = prisma;
  }
  async createPost({ id, title, slug, content, userId, parentId, quoteId, repostId }) {
    const newPost = await this.#prisma.post.create({
      data: {
        id,
        title,
        slug,
        content,
        author: { connect: { id: userId } },
        ...(parentId && { parent: { connect: { id: parentId } } }),
        ...(quoteId && { quote: { connect: { id: quoteId } } }),
        ...(repostId && { repost: { connect: { id: repostId } } }),
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullname: true,
            avatar: true
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
  async getTimelinePosts({ cursor, take = 6 }, userId) {
    const where = {};
    if (cursor) where.id = { lt: cursor };
  
    const rawPosts = await this.#prisma.post.findMany({
      take,
      where,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, username: true, fullname: true, avatar: true } },
        quote: { include: { author: { select: { id: true, username: true, fullname: true, avatar: true } } } },
        repost: { include: { author: { select: { id: true, username: true, fullname: true, avatar: true } } } },
        likes: { select: { userId: true } },
      },
    });
  
    const replies = rawPosts.filter(p => p.parentId);
  
    const parentsToFetch = [...new Set(replies.map(r => r.parentId))];
    const parents = parentsToFetch.length
      ? await this.#prisma.post.findMany({
          where: { id: { in: parentsToFetch } },
          include: {
            author: { select: { id: true, username: true, fullname: true, avatar: true } },
            likes: { select: { userId: true } },
          },
        })
      : [];
  
    const parentsMap = new Map(
      parents.map(p => [
        p.id,
        { ...p, isLiked: userId ? p.likes.some(l => l.userId === userId) : false, likeCount: p.likes.length },
      ])
    );
  
    return rawPosts.map(post => {
      const basePost = {
        ...post,
        isLiked: userId ? post.likes.some(l => l.userId === userId) : false,
        likeCount: post.likes.length,
      };
      if (post.parentId) {
        return { parent: parentsMap.get(post.parentId) || null, reply: basePost };
      } else {
        return { post: basePost };
      }
    });
  }  
  async getUserForumPosts(userId, forumType, sort) {
    const orderDirection = sort === "oldest" ? "asc" : "desc";
    let whereCondition = { authorId: userId };

    if (forumType === "main") {
      whereCondition.parentId = null;
    } else if (forumType === "reply") {
      whereCondition.parentId = { not: null };
    }

    return await this.#prisma.post.findMany({
      where: whereCondition,
      orderBy: { createdAt: orderDirection },
    });
  }
  async getPost(id, userId) {
    const post = await this.#prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, fullname: true, username: true, avatar: true } },
        parent: {
          include: {
            author: { select: { id: true, fullname: true, username: true, avatar: true } },
          },
        },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            author: { select: { id: true, fullname: true, username: true, avatar: true } },
            likes: { select: { userId: true } },
          },
        },
        likes: userId ? { where: { userId } } : false,
      },
    });

    if (!post) return null;

    post.isLiked = userId ? post.likes.length > 0 : false;
    delete post.likes;

    post.replies = post.replies.map((reply) => {
      const isLiked = userId
        ? reply.likes.some((like) => like.userId === userId)
        : false;

      return {
        ...reply,
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
    const post = await this.#prisma.post.findUnique({
      where: { id },
      select: { parentId: true },
    });

    const queries = [];
    if (post?.parentId) {
      queries.push(
        this.#prisma.post.update({
          where: { id: post.parentId },
          data: { replyCount: { decrement: 1 } },
        })
      );
    }

    queries.push(
      this.#prisma.like.deleteMany({
        where: { postId: id },
      })
    );

    queries.push(
      this.#prisma.post.delete({
        where: { id },
      })
    );

    const [_, __, deletedPost] = await this.#prisma.$transaction(queries);
    return deletedPost;
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
            avatar: true
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
