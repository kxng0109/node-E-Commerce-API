import { config } from "dotenv";
import Stripe from "stripe";
import { clearCart, getUserCart } from "../db/cart.db.js";
import { UnauthorizedError } from "../errors/index.js";
import updateTable from "../utils/updateTable.util.js";
config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const webhookController = async(req, res, next) =>{
	let event = req.body;
	try{
		if(endpointSecret){
			try{
				const signature = req.headers["stripe-signature"];
				event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret)
			} catch(err){
				throw new UnauthorizedError(`Webhook Signature Verification Failed. ${err.message}`);
			}
		} else{
			throw new Error("Webhook secret is not configured.")
		}

		switch(event.type){
			case "payment_intent.succeeded":
				const paymentIntent = event.data.object;
				const customerID = paymentIntent.metadata.customerID;
				const cart = await getUserCart(customerID);
				cart.forEach(async(item) =>{
					await updateTable(item.product_id, item.quantity);
					await clearCart(customerID);
				});
			break;
		};
		res.json({received: true});
	}catch(err){
		next(err);
	}
};

export default webhookController;