import { Router } from "express";
import {
    addProduct,
    deleteProduct,
    updateProduct,
    viewProduct,
    viewProducts,
} from "../controllers/products.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import checkProductExistsMiddleware from "../middlewares/checkProductExists.middleware.js";
import checkRole from "../middlewares/checkRole.middleware.js";

const router = Router();

router.route("/products").get(viewProducts);
router
    .route("/product/:productName")
    .get(viewProduct)
    .patch(
        authMiddleware,
        checkRole,
        checkProductExistsMiddleware,
        updateProduct,
    )
    .delete(
        authMiddleware,
        checkRole,
        checkProductExistsMiddleware,
        deleteProduct,
    );
router.route("/product/").post(authMiddleware, checkRole, addProduct);

export default router;
