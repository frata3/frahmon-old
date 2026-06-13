import { Router } from 'express';
import MarketDiscountController from '../controllers/market.discount.controller.js';

const router = Router();

router.post("/new/product", MarketDiscountController.createProductDiscount);
router.post("/apply/:discountCode/:orderId", MarketDiscountController.applyDiscount);
router.delete("/remove/:discountId/:orderId", MarketDiscountController.removeDiscount);

// router.post("/new/basket", MarketDiscountController.addDiscountToBasket);
// router.post("/apply/:basket", MarketDiscountController.addDiscountToBasket);

export default router;
  