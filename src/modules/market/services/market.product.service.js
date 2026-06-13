import autoBind from "auto-bind";
import { Product, ProductDetail} from "../models/market.product.model.js";
import { Basket, BasketItem } from "../models/market.basket.model.js";
import User from "../models/market.user.model.js";

class MarketProductService {
  #productModel;
  #detailModel;
  #basketItemModel;
  #basketModel
  #userModel;
  constructor() {
    autoBind(this);
    this.#productModel = Product;
    this.#detailModel = ProductDetail;
    this.#basketModel = Basket;
    this.#basketItemModel = BasketItem;
    this.#userModel = User;

  }
  async createProduct(data) {
    const { sellerId, title, slug, price, count, description, attributes = [] } = data;
    const product = await this.#productModel.create({
      sellerId,
      title,
      slug,
      price,
      count,
      description,
    });
  
    if (attributes.length > 0) {
      const productDetails = attributes.map(attr => ({
        productId: product.id,
        key: attr.key,
        value: attr.value,
      }));
      await this.#detailModel.bulkCreate(productDetails);
    }
    return product;
  }
  async getProductByPk(id) {
    const product = await this.#productModel.findByPk(id);
    return product
  }
  async getProductById(id, userId) {
    const product = await this.#productModel.findOne({
      where: { id },
      attributes: ["id","sellerId","title","slug","price","count"],
      include: [
        { model: this.#detailModel, as: "details", attributes: ["key","value"] },
        { model: this.#userModel, as: "seller", attributes: ["fullname","username"] },
      ],
    });
    
    if (!product) return null;

    const plainProduct = product.get({ plain: true });
    plainProduct.addedCount = 0;
  
    if (userId) {
      const basketItem = await this.#basketItemModel.findOne({
        where: { productId: id },
        include: [
          {
            model: this.#basketModel,
            as: "basket",
            where: { buyerId: userId },
          },
        ],
        attributes: ["count"],
      });
      plainProduct.addedCount = basketItem ? basketItem.count : 0;
    }
    return plainProduct;
  }
}
export default new MarketProductService();