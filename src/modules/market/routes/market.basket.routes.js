import { Router } from 'express';
import MarketBasketController from '../controllers/market.basket.controller.js';

const router = Router();

router.post("/add/:productId/:sellerId" , MarketBasketController.addToBasket);
router.delete("/remove/:productId/:sellerId" , MarketBasketController.removeFromBasket);
router.get("/", MarketBasketController.getUserBaskets);

export default router;
  