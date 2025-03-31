import { StatusCodes } from "http-status-codes";
import {
    addItemToCart,
    clearCart,
    deleteFromCart,
    getProductFromCart,
    getUserCart,
    updateItemInCart,
} from "../db/cart.db.js";

export const getCartItemsController = async (req, res) => {
	try {
		const { id: user_id } = req.user;
		const cart = await getUserCart(user_id);
		if (!cart) {
			res.status(StatusCodes.NOT_FOUND).json({
				message: "There is nothing in your cart.",
			});
		} else {
			res.status(StatusCodes.OK).json(cart);
		}
	} catch (err) {
		res.status(StatusCodes.BAD_REQUEST).json(err);
		throw new Error(err);
	}
};

export const addToCartController = async (req, res) => {
	try {
		const { product_id, quantity } = req.body;
		const { id: user_id } = req.user;
		if (!product_id || !quantity) {
			throw new Error("Product ID and quantity needed.");
		}

		if (Number(product_id) === NaN || Number(quantity) === NaN) {
			throw new Error("Invalid product ID or quantity.");
		}

		const cart = await getProductFromCart(product_id, user_id);
		if (!cart) {
			const cart = await addItemToCart(user_id, product_id, quantity);
			res.status(StatusCodes.CREATED).json({
				message: "Added to cart.",
				cart,
			});
		} else {
			res.status(StatusCodes.BAD_REQUEST).json({
				message: "Product exists in your cart.",
			});
		}
	} catch (err) {
		throw new Error(err);
	}
};

export const updateCartController = async (req, res) => {
	try {
		const { productID } = req.params;
		const { quantity } = req.body;
		const { id: user_id } = req.user;
		if (!productID || !quantity) {
			throw new Error("Product ID and quantity needed.");
		}

		if (Number(productID) === NaN || Number(quantity) === NaN) {
			throw new Error("Invalid product ID or quantity.");
		}

		const cart = await updateItemInCart(user_id, productID, quantity);
		if (!cart) {
			res.status(StatusCodes.NOT_FOUND).json({
				message: "Product is not in your cart. ",
			});
		} else {
			res.status(StatusCodes.OK).json({
				message: "Updated cart successfully. ",
				cart,
			});
		}
	} catch (err) {
		throw new Error(err);
	}
};

export const deleteFromCartController = async (req, res) => {
	try {
		const { productID } = req.params;
		const { id: user_id } = req.user;

		if (!productID) {
			throw new Error("Product ID needed.");
		}

		if (Number(productID) === NaN) {
			throw new Error("Invalid product ID.");
		}

		const isInCart = await getProductFromCart(productID, user_id);
		if (!isInCart) {
			res.status(StatusCodes.NOT_FOUND).json({
				message: "Product not found in your cart. ",
			});
		} else {
			await deleteFromCart(productID, user_id);
			res.status(StatusCodes.OK).json({
				message: "Product removed from your cart. ",
			});
		}
	} catch (err) {
		throw new Error(err);
	}
};

export const clearCartController = async (req, res) => {
	try {
		const { id: user_id } = req.user;
		await clearCart(user_id);
		res.status(StatusCodes.OK).json({
			message: "Cart cleared successfully. ",
		});
	} catch (err) {
		throw new Error(err);
	}
};
