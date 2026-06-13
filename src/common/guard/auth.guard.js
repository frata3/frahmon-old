import UserService from '../../modules/user/services/user.service.js';

const Authorization = async (req, res, next) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(401).json({
          status: "error",
          error_code: "unauthorized",
          message: "Authentication required"
        });
      }
      return res.redirect("/auth");
    }
    const user = await UserService.findOne({ _id: req.session.user.id });
    if (!user) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(401).json({
          status: "error",
          error_code: "user_not_found",
          message: "User not found"
        });
      }
      return res.redirect("/auth");
    }
    req.session.user = {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      username: user.username
    };
    return next();
  } catch (error) {
    console.error("Authorization error:", error);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(500).json({
        status: "error",
        error_code: "authorization_failed",
        message: "Internal server error"
      });
    }
    next(error);
  }
};
export default Authorization;