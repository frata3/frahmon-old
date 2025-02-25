const userModel = require("../../modules/user/user.model");

const Authorization = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.redirect("/auth/login");
    }
    const user = await userModel
      .findById(req.session.user.id, { password: 0, __v: 0, updatedAt: 0 })
      .lean();

    if (!user) {
      console.log("auth 3");

      return res.redirect("/auth/login");
    }
    console.log("auth 4");

    req.session.user = user;
    return next();
  } catch (error) {
    console.error("Authorization - Error:", error);
    return res.redirect("/auth/login");
  }
};

module.exports = Authorization;
