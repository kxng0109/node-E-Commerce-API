import { getUserCart } from "../db/cart.db.js";
import handlePayout from "../services/stripe.service.js";

const checkOutController = async(req, res, next) =>{
	try{
		const {id:user_id} = req.user;
		const cart = await getUserCart(user_id);
		const session = await handlePayout(cart);
		res.send(session.url);
	}catch(err){
		next(err)
	}
}

export default checkOutController;