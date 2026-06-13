import autoBind from "auto-bind";
import MarketModel from "../models/market.user.model.js";
class MarketUserService {
  #marketModel;
  constructor() {
    autoBind(this);
    this.#marketModel = MarketModel;
  }
  async createOrUpdateUser(data) {
    const [user] = await this.#marketModel.upsert({
      id: data.id,
      username: data.username,
      fullname: data.fullname,
      avatar: data.avatar,
    });
    return user;
  }
}
export default new MarketUserService();
