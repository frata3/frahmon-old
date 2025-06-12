const autoBind = require("auto-bind");
const UserService = require("../services/user.service");
const ConnectionService = require("../services/user.connection.service");
class UserController {
  #userService;
  #connectionService;
  constructor() {
    autoBind(this);
    this.#userService = UserService;
    this.#connectionService = ConnectionService;
  }
  async getUsersList(req, res, next) {
    try {
      const users = await this.#userService.findUsersList();
      res.render("./pages/user/me/users-list.ejs", { 
        title: "کاربران",
        users,
        user: req.session.user,
      });
    } catch (error) {
      next(error);
    }
  }
  
}
module.exports = new UserController();
