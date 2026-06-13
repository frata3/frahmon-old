import { Router } from 'express';
import MarketPaymentController from '../controllers/market.payment.controller.js';

const router = Router();

router.get("/:paymentId", MarketPaymentController.getPayment);
 
router.patch("/:paymentId/authority", MarketPaymentController.updatePaymentAuthority);

export default router;
  