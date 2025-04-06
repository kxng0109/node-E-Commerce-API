import { Router } from "express";
import {
    addToCartController,
    clearCartController,
    deleteFromCartController,
    getCartItemsController,
    updateCartController,
} from "../controllers/cart.controller.js";
import checkOutController from "../controllers/checkout.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import checkProductExistsMiddleware from "../middlewares/checkProductExists.middleware.js";
import compareQuantity from "../middlewares/compareQuantity.middleware.js";
import validateCartItem from "../middlewares/validateCartItem.middleware.js";

const router = Router();
router.use(authMiddleware);

router
	.route("/")
	.get(getCartItemsController)
	.post(
		validateCartItem,
		checkProductExistsMiddleware,
		compareQuantity,
		addToCartController,
	)
	.delete(clearCartController);

router
	.route("/:productID")
	.patch(
		validateCartItem,
		checkProductExistsMiddleware,
		compareQuantity,
		updateCartController,
	)
	.delete(deleteFromCartController);

router.post("/checkout", checkOutController);

export default router;
