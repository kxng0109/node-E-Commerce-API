import { StatusCodes } from "http-status-codes";
import {
    addItemToCart,
    clearCart,
    deleteFromCart,
    getProductFromCart,
    getUserCart,
    updateItemInCart,
} from "../db/cart.db.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import checkProductExists from "../utils/checkProductExists.util.js";
import sendSuccess from "../utils/response.util.js";

export const getCartItemsController = async (req, res, next) => {
	try {
		const { id: user_id } = req.user;

		const cart = await getUserCart(user_id);
		if (!cart) {
			throw new NotFoundError("There is nothing in your cart.");
		}

		sendSuccess(res, StatusCodes.OK, "Cart retrieved successfully", {cart})
	} catch (err) {
		next(err);
	}
};

export const addToCartController = async (req, res, next) => {
	try {
		const { product_id, quantity } = req.body;
		const { id: user_id } = req.user;

		const exists = await checkProductExists(product_id);
		if(!exists) throw new NotFoundError("Product does not exists.");

		const cart = await getProductFromCart(product_id, user_id);
		if (!cart) {
			const cart = await addItemToCart(user_id, product_id, quantity);
			sendSuccess(res, StatusCodes.CREATED, "Product added to cart.", cart)
		} else {
			throw new BadRequestError("Product exists in your cart.");
		}
	} catch (err) {
		next(err);
	}
};

export const updateCartController = async (req, res, next) => {
	try {
		const { productID } = req.params;
		const { quantity } = req.body;
		const { id: user_id } = req.user;

		const exists = await checkProductExists(productID);
		if(!exists) throw new NotFoundError("Product does not exists.");

		const cart = await updateItemInCart(user_id, productID, quantity);
		if (!cart) {
			throw new NotFoundError("Product is not in your cart. ");
		}

		sendSuccess(res, StatusCodes.OK, "Updated cart successfully.", cart)
	} catch (err) {
		next(err);
	}
};

export const deleteFromCartController = async (req, res, next) => {
	try {
		const { productID } = req.params;
		const { id: user_id } = req.user;

		if (!productID) {
			throw new BadRequestError("Product ID needed.");
		}

		if (Number(productID) === NaN) {
			throw new BadRequestError("Invalid product ID.");
		}

		const exists = await checkProductExists(productID);
		if(!exists) throw new NotFoundError("Product does not exists.");

		const isInCart = await getProductFromCart(productID, user_id);
		if (!isInCart) {
			throw new NotFoundError("Product not found in your cart.");
		}

		await deleteFromCart(productID, user_id);
		sendSuccess(res, StatusCodes.OK, "Product removed from your cart");
	} catch (err) {
		next(err);
	}
};

export const clearCartController = async (req, res, next) => {
	try {
		const { id: user_id } = req.user;
		await clearCart(user_id);
		sendSuccess(res, StatusCodes.OK, "Cart cleared successfully")
	} catch (err) {
		next(err);
	}
};
