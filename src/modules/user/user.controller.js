const autoBind = require("auto-bind");
const UserService = require("./user.service");

class UserController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = UserService;
  }
  
}

module.exports = new UserController();
