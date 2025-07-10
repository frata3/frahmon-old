import UserService from '../../modules/user/services/user.service.js';

const Authorization = async (req, res, next) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.redirect("/auth/login");
    }
    const user = await UserService.findOne({ _id: req.session.user._id });

    if (!user) {
      return res.redirect("/auth/login");
    }
    req.session.user = user;
    return next();
  } catch (error) {
    next(error);
  }
};

export default Authorization;
