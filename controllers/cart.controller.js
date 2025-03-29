import { StatusCodes } from "http-status-codes";
import {
    addToCart,
    checkCart,
    clearCart,
    createCart,
    decrementItemQuantity,
    deleteItemFromCart,
    findItemInCart,
    getCartItemProperty,
    incrementItemQuantity,
} from "../db/cart.db.js";

export const getCartItemsController = async (req, res) => {
	try {
		const { cartName } = req.user;
		const cart = await checkCart(cartName);
		//If no cart is found, that means the user hasn't added anything to it..
		if (!cart.id) {
			res.status(StatusCodes.OK).json({ message: "Your cart is empty." });
		} else {
			res.status(StatusCodes.OK).json(cart);
		}
	} catch (err) {
		res.status(StatusCodes.BAD_REQUEST).json(err)
		throw new Error(err);
	}
};

export const addToCartController = async (req, res) => {
	try {
		const { cartName } = req.user;
		const {product_id, quantity} = req.body;

		if(!product_id || !quantity){
			throw new Error("Product ID and quantity needed.");
		}

		//Let's check if the user has a cart
		const isCartAvailable = await checkCart(cartName);
		console.log(isCartAvailable)
		//If it's not avaliable, we'll create one.
		if (!isCartAvailable) {
			let tableCreated = await createCart(cartName);
			console.log(tableCreated);
		}
		//Let's check if the product is in the cart and the quantity of the product in the cart
		const quantityInCart = await getCartItemProperty(
			"quantity",
			cartName,
			product_id,
		);
		//If the item is already in the cart, increment the quantity by 1
		if (quantityInCart) {
			const updateCart = await incrementItemQuantity(cartName, product_id);
			res.status(StatusCodes.OK).json({
				message: "Added to cart",
				updateCart,
			});
		} else {
			//If not, just add it to the cart
			const add = await addToCart(cartName, product_id, quantity);
			res.status(StatusCodes.OK).json({ message: "Added to cart", add });
		}
	} catch (err) {
		throw new Error(err);
	}
};

export const decrementQuantityController = async (req, res) => {
	try {
		const { cartName } = req.user;
		const product_id = 1; //Update this as well;
		//Let's check if the user has a cart and throw an error if they don't
		const isCartAvailable = await checkCart(cartName);
		if (!isCartAvailable) {
			res.status(StatusCodes.BAD_REQUEST).json({
				message: "You do not have any items in your cart",
			});
			return;
		}

		//Let's check if the product is in the cart and the quantity of the product in the cart
		const quantityInCart = await getCartItemProperty(
			"quantity",
			cartName,
			product_id,
		);
		//If it's in the cart and it's quantity is greater than 0(which it should be, lol), let's remove it from the cart
		//Else, let's send an error;
		if (quantityInCart && quantityInCart > 0) {
			const updateCart = await decrementItemQuantity(cartName, product_id);
			res.status(StatusCodes.OK).json({
				message: "Removed from your cart",
				updateCart,
			});
		} else {
			res.status(StatusCodes.BAD_REQUEST).json({
				message: "Product doesn't exist in your cart.",
			});
		}
	} catch (err) {
		throw new Error(err);
	}
};

export const removeItemFromCartController = async (req, res) => {
	try {
		const { cartName } = req.user;
		const product_id = 1;

		const isCartAvailable = await checkCart(cartName);
		if (!isCartAvailable) {
			res.status(StatusCodes.BAD_REQUEST).json({
				message: "You do not have a cart.",
			});
			return;
		}

		const isInCart = await findItemInCart(cartName, product_id);
		if (!isInCart) {
			res.status(StatusCodes.BAD_REQUEST).json({
				message: "Product not in cart.",
			});
			return;
		}

		await deleteItemFromCart(cartName, product_id);
		res.status(StatusCodes.OK).json({ message: "Item removed from cart" });
	} catch (err) {
		throw new Error(err);
	}
};

export const clearCartController = async (req, res) => {
	try {
		const { cartName } = req.user;

		//Let's check if the user has a cart and throw an error if they don't
		const isCartAvailable = await checkCart(cartName);
		if (!isCartAvailable) {
			res.status(StatusCodes.BAD_REQUEST).json({
				message: "You don not have any items in your cart",
			});
		} else {
			await clearCart(cartName);
			res.status(StatusCodes.OK).json({
				message: "Cart cleared successfully",
			});
		}
	} catch (err) {
		throw new Error(err);
	}
};
