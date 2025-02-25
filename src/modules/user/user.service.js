const autoBind = require("auto-bind");
const UserModel = require("./user.model");
const bcrypt = require("bcrypt");

class UserService {
  #model;
  constructor() {
    autoBind(this);
    this.#model = UserModel;
  }

  async createUser(userData) {
    return this.#model.create(userData);
  }

  async authenticate({ email, password }) {
    const user = await this.#model.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("ایمیل یا رمز عبور اشتباه است");
    }
    return user;
  }
}

module.exports = new UserService();
