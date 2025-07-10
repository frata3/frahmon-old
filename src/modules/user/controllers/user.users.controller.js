import autoBind from 'auto-bind';
import UserService from '../services/user.service.js';
import ConnectionService from '../services/user.connection.service.js';
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
export default new UserController();
