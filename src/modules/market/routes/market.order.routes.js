import { Router } from 'express';
import MarketOrderController from '../controllers/market.order.controller.js';

const router = Router();

router.post("/new/:basketId", MarketOrderController.createOrder);
router.post("/exist", MarketOrderController.checkOrder);
router.get("/:orderId", MarketOrderController.showOrder);

export default router;
  