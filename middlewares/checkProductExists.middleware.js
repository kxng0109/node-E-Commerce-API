import { getProductById } from "../db/products.db.js";
import BadRequestError from "../errors/bad-request.error.js";

const checkProductExistsMiddleware = async (req, res, next) => {
	try {
		const { product_id } = req.body;
		const { productID: id } = req.params;
		const productID = product_id || id;

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
