const bcrypt = require("bcrypt");
const userService = require("../../../modules/user/services/user.service");
const connectionService = require("../../../modules/user/services/user.connection.service");

const userResolvers = {
  Query: {
    _dummy: () => "OK",
    getFollowers: async (_, { userId }) => {
      return await connectionService.getFollowers(userId);
    },
    getFollowings: async (_, { userId }) => {
      return await connectionService.getFollowings(userId);
    },
    getConnectionStatus: async (_, { userId, targetId }) => {
      return await connectionService.getConnectionStatus(userId, targetId);
    },
  },
  Mutation: {
    updatePersonalInfo: async (_, { field, value }, context) => {
      const userId = context.session?.user?._id;
      if (!userId) return { success: false, message: "شما وارد نشده‌اید." };

      const user = await userService.findById(userId);
      if (!user) return { success: false, message: "کاربر پیدا نشد." };

      if (!user.schema.path(field)) {
        return { success: false, message: "فیلد نامعتبر است." };
      }

      if (field === "email") {
        const existingUser = await userService.isEmailTaken(value);
        if (existingUser && existingUser._id.toString() !== userId) {
          return {
            success: false,
            message: "این ایمیل قبلاً استفاده شده است.",
          };
        }
      }

      if (field === "username") {
        const existingUser = await userService.isUsernameTaken(value);
        if (existingUser && existingUser._id.toString() !== userId) {
          return {
            success: false,
            message: "این نام کاربری قبلاً استفاده شده است.",
          };
        }
      }

      if (field === "password") {
        const isSame = await bcrypt.compare(value, user.password);
        if (isSame) {
          return {
            success: false,
            message: "رمز جدید نباید با قبلی یکی باشد.",
          };
        }
      }

      await userService.update(user, field, value);
      return { success: true, message: "اطلاعات بروزرسانی شد." };
    },
    followUser: async (_, { targetId }, context) => {
      const userId = context.session?.user?._id;
      if (!userId) return { success: false, message: "شما وارد نشده‌اید." };
      console.log("graphError : "+ userId+" skip "+ targetId);

      const result = await connectionService.followUser(userId, targetId);
      return result;
    }, 

    unfollowUser: async (_, { targetId }, context) => {
      const userId = context.session?.user?._id;
      if (!userId) return { success: false, message: "شما وارد نشده‌اید." };

      const result = await connectionService.unfollowUser(userId, targetId);
      return result;
    },

    acceptFollowRequest: async (_, { requesterId }, context) => {
      const userId = context.session?.user?._id;
      if (!userId) return { success: false, message: "شما وارد نشده‌اید." };

      const result = await connectionService.acceptFollowRequest(userId, requesterId);
      return result;
    },

    rejectFollowRequest: async (_, { requesterId }, context) => {
      const userId = context.session?.user?._id;
      if (!userId) return { success: false, message: "شما وارد نشده‌اید." };

      const result = await connectionService.rejectFollowRequest(userId, requesterId);
      return result;
    },
  },
};

module.exports = userResolvers;
