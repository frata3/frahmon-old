import autoBind from 'auto-bind';

class HomeService {
  #model;
  constructor() {
    autoBind(this);
    // this.#model = PostModel;
  }
  
}
export default new HomeService();
