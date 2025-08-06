import autoBind from "auto-bind";
import UserService from "../services/user.service.js";
import ConnectionService from "../services/user.connection.service.js";
class UserController {
  #userService;
  #connectionService;
  constructor() {
    autoBind(this);
    this.#userService = UserService;
    this.#connectionService = ConnectionService;
  }
  async getUserProfile(req, res, next) {
    try {
      const { username } = req.params;
      const currentUserId = req.session.user?._id;

      const user = await this.#userService.findByUsername(username);
      if (!user) {
        return res
          .status(404)
          .render("errors/user-not-found.ejs", { message: "کاربر پیدا نشد" });
      }

      const followersCount = await this.#connectionService.countFollowers(
        user.id
      );
      const followingCount = await this.#connectionService.countFollowing(
        user.id
      );

      let isFollowing = false;
      if (currentUserId) {
        const connection = await this.#connectionService.findOne({
          source: currentUserId,
          target: user._id,
          type: "follow",
          status: "active",
        });
        isFollowing = !!connection;
      }

      res.addAssets({
        css: ["/assets/css/user/public.css"],
        js: [{ src: "/scripts/user/public.js", type: "module", defer: true }],
      });

      res.render("./pages/user/public/profile.ejs", {
        title: user.fullname,
        user,
        followersCount,
        followingCount,
        isFollowing,
        isMe: currentUserId?.toString() === user.id.toString(),
      });
    } catch (err) {
      next(err);
    }
  }
  async getUserBlogPosts(req, res, next) {
    try {
      const user = await this.#userService.findByUsername(req.params.username);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "کاربر پیدا نشد" });
      }
      const userId = user._id;

      const { sort = "latest" } = req.query;

      const blogPosts = await this.#userService.findBlogPosts(userId, sort);

      res.render(
        "pages/user/me/blog",
        {
          posts: blogPosts,
          layout: false,
        },
        (err, html) => {
          if (err)
            return res.status(500).send("خطا در بارگزاری پست‌های بلاگ" + err);
          res.send(html);
        }
      );
    } catch (err) {
      next(err);
    }
  }
  async getUserForumPosts(req, res, next) {
    try {
      const user = await this.#userService.findByUsername(req.params.username);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "کاربر پیدا نشد" });
      }
      const userId = user._id;
      const { sort = "latest", forumType = "all" } = req.query;

      const forumPosts = await this.#userService.getForumPosts(
        userId,
        forumType,
        sort
      );

      res.render(
        "pages/user/me/forum",
        {
          posts: forumPosts,
          layout: false,
        },
        (err, html) => {
          if (err)
            return res.status(500).send("خطا در بارگزاری پست‌های فروم" + err);
          res.send(html);
        }
      );
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}
export default new UserController();
