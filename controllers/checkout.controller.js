import { getUserCart } from "../db/cart.db.js";
import BadRequestError from "../errors/bad-request.error.js";
import handlePayout from "../services/stripe.service.js";

const checkOutController = async (req, res, next) => {
	try {
		const { id: user_id } = req.user;
		if (!user_id) {
			throw new BadRequestError("User ID needed for checkout.");
		}
		const cart = await getUserCart(user_id);
		const session = await handlePayout(cart, user_id);
		res.send(session.url);
	} catch (err) {
		next(err);
	}
};

export default checkOutController;
