import autoBind from "auto-bind";
import MarketProductService from "../services/market.product.service.js";
import generateSlug from "../../../common/utils/slugify.util.js";
class MarketProductController {
  #marketProductService;
  constructor() {
    autoBind(this);
    this.#marketProductService = MarketProductService;
  }
  async createProductPage(req, res, next) {
    try {
      res.addAssets({
        css: ["/assets/css/market/new-product.css"],
        js: [
          { src: "/scripts/market/new-product.js", type: "module", defer: true },
        ],
      });
    res.render("./pages/market/product/new-product", {
      title: "محصول جدید"
    })
  } catch (err) {
    console.error(err);
    next(err)
  }
  }
  async createProduct(req, res, next) {
    try {
      const userId = req.session?.user?._id;
      const { title, price, count, description, attributes } = req.body;
      const product = await this.#marketProductService.createProduct({
        sellerId: userId,
        title,
        slug: generateSlug(title),
        price,
        count,
        description,
        attributes, 
      });
      res.redirect(`/market/product/${product.id}/${product.slug}`);
    } catch (err) {
      console.error("Error in createProduct:", err);
      next(err);
    }
  }
  async getProduct(req, res, next) {
    try {
      const userId = req.session?.user?._id;
      const { id } = req.params;
      const product = await this.#marketProductService.getProductById(id, userId);
      // if(product) res.status("200").json({product})
      if (!product) {
        return res
          .status(404)
          .render("errors/product-not-found.ejs", { title: "محصول یافت نشد" });
      }
      res.addAssets({
        css: ["/assets/css/market/product.css"],
        js: [
          { src: "/scripts/market/product.js", type: "module", defer: true },
        ],
      });
      res.render("pages/market/product/product.ejs", {
        title: "صفحه اصلی",
        product,
      });
    } catch (error) {
      next(error);
    }
  }
  async redirectToProduct(req, res, next) {
    try {
      console.log("inja : ");
      const { id } = req.params;
      const product = await this.#marketProductService.getProductById(id);
      if (!product) return res.status(404).render("errors/product-not-found.ejs", { title: "محصول یافت نشد" });
      return res.redirect(301, `/market/product/${id}/${product.slug}`);
    } catch (err) {
      next(err);
    }
  }
}
export default new MarketProductController();
