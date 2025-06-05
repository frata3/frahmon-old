const bcrypt = require("bcrypt");
const userService = require("../../../modules/user/services/user.service");

const userResolvers = {
  Query: {
    _dummy: () => "OK",
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
  },
};

module.exports = userResolvers;
