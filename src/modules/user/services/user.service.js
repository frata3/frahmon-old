const autoBind = require("auto-bind");
const UserModel = require("../models/user.model");

class UserService {
  #model;
  constructor() {
    autoBind(this);
    this.#model = UserModel;
  }

  async findOne(query) {
    return await this.#model.findOne(query);
  }

  async create(userData) {
    const user = new this.#model(userData);
    await user.save();
    return user
  }
  async findById(id) {
    return await this.#model.findById(id);
  }
}

module.exports = new UserService();
