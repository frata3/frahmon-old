const autoBind = require("auto-bind");
const UserService = require("../user/user.service");

class AuthService {
  #model;
  #userService;
  constructor() {
    autoBind(this);
    this.#userService = UserService;
  }

  async createUser(userData) {
    return this.#userService.create(userData);
  }

  async authenticate({ email, password }) {
    const user = await this.#userService.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("ایمیل یا رمز عبور اشتباه است");
    }
    return user;
  }
}

module.exports = new AuthService();
