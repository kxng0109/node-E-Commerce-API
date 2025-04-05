import { Router } from "express";
import {
    addProduct,
    viewProduct,
    viewProducts,
} from "../controllers/products.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/products").get(viewProducts);
router.route("/product/:productName").get(viewProduct);
router.route("/product/").post(authMiddleware, addProduct);

export default router;
