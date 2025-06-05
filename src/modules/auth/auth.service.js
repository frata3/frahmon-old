const autoBind = require("auto-bind");
const UserService = require("../user/services/user.service");
const bcrypt = require("bcrypt");
class AuthService {
  #userService;
  constructor() {
    autoBind(this);
    this.#userService = UserService;
  }

  async createUser(userData) {
    const existingUser = await this.#userService.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("ایمیل قبلا ثبت شده است");
    }
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
