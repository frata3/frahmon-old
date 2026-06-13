import { Router } from 'express';
import marketProductController from '../controllers/market.product.controller.js';

const router = Router();

router.get("/new", marketProductController.createProductPage)
router.post("/new", marketProductController.createProduct)
router.get("/:id", marketProductController.redirectToProduct);
router.get("/:id/:slug", marketProductController.getProduct);

export default router;
  