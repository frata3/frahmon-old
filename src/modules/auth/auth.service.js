import autoBind from 'auto-bind';
import UserService from '../user/services/user.service.js';
import bcrypt from 'bcrypt';
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

export default new AuthService();
