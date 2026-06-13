import { Router } from 'express';
import marketController from '../controllers/market.controller.js';
import marketProductRoutes from './market.product.routes.js';
import marketOrderRoutes from './market.order.routes.js';
import marketDiscountRoutes from './market.discount.routes.js';
import marketPaymentRoutes from './market.payment.routes.js';
import marketBasketRoutes from './market.basket.routes.js';
const router = Router();

router.get("/", marketController.getMainPage);

router.use("/product", marketProductRoutes);
router.use("/basket", marketBasketRoutes);
router.use("/order", marketOrderRoutes);
router.use("/discount", marketDiscountRoutes);
// router.use("/payment", marketPaymentRoutes);

// router.use("/rbac", rbacRoutes);

export default router;