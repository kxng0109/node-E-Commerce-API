import { getProductById } from "../db/products.db.js";
import { BadRequestError, UnprocessableEntityError } from "../errors/index.js";

const compareQuantity = async (req, res, next) => {
	try {
		const { quantity: purchaseQuantity} = req.body;
		const {productID} = req.user;
		const product = await getProductById(productID);
		const availableStock = Number(product.stock_quantity);
		const inStock = product.available;
		const stockAfterPurchase = availableStock - Number(purchaseQuantity);

		if (availableStock === 0 || inStock === "no") {
			throw new UnprocessableEntityError(
				`This product, ${product.name}, from ${product.brand}, is out of stock and cannot be added to the cart.`,
			);
		}

		if (stockAfterPurchase < 0) {
			throw new BadRequestError(
				"Quantity can not be greater than available stock.",
			);
		}
		next();
	} catch (err) {
		next(err);
	}
};

export default compareQuantity;
