import autoBind from 'auto-bind';
import UserService from '../services/user.service.js';
class UserController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = UserService;
  }
  
}
export default new UserController();
