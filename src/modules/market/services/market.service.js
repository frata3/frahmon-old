import autoBind from "auto-bind";
import { Product as MarketModel} from "../models/market.product.model.js";
class MarketService {
  #marketModel;
  constructor() {
    autoBind(this);
    this.#marketModel = MarketModel;
  }
  async getProducts({ limit = 10, offset = 0 } = {}) {
    return await this.#marketModel.findAll({});
  }
  
}
export default new MarketService();
