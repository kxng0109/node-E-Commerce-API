import { getProductById } from "../db/products.db.js";
import BadRequestError from "../errors/bad-request.error.js";

const checkProductExistsMiddleware = async (req, res, next) => {
	try {
		let { productID } = req.user;
		const { productName } = req.params;
		productID = productID || productName;

		const product = await getProductById(productID);
		if (!product) {
			throw new BadRequestError("Product does not exist.");
		}
		
		req.user = { ...req.user, productID };
		next();
	} catch (err) {
		next(err);
	}
};

export default checkProductExistsMiddleware;
