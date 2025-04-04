import { Router } from "express";
import { viewProduct, viewProducts } from "../controllers/products.controller.js";


const router = Router();

router.route("/products").get(viewProducts);
router.route("/product/:productName").get(viewProduct);

export default router;
