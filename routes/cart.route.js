import { Router } from "express";
import { addToCartController, clearCartController, getCartItemsController, removeItemFromCartController } from "../controllers/cart.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import generateCartName from "../middlewares/cartName.middleware.js";

const router = Router();
router.use(authMiddleware, generateCartName);

router.route("/").get(getCartItemsController).post(addToCartController).delete(clearCartController);
router.route("/:id").patch(addToCartController).delete(removeItemFromCartController)
export default router;