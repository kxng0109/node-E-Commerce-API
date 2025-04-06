import { BadRequestError } from "../errors/index.js";

const validateCartItem = async (req, res, next) => {
	try {
		const { product_id } = req.body;
		const { productID: id } = req.params;
		const productID = product_id || id;
		const { quantity } = req.body;

		if (!productID || !quantity) {
			throw new BadRequestError("Product ID and quantity needed.");
		}

		if (
			Number.isNaN(Number(productID)) ||
			Number.isNaN(Number(quantity)) ||
			Number(quantity) <= 0
		) {
			throw new BadRequestError("Invalid product ID or quantity.");
		}

		req.user = { ...req.user, productID, quantity };
		next();
	} catch (err) {
		next(err);
	}
};

export default validateCartItem;