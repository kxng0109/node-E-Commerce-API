import { Router } from "express";
import { addToCartController, clearCartController, deleteFromCartController, getCartItemsController, updateCartController } from "../controllers/cart.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authMiddleware);

router.route("/").get(getCartItemsController).post(addToCartController).delete(clearCartController);
router.route("/:productID").patch(updateCartController).delete(deleteFromCartController)

export default router;