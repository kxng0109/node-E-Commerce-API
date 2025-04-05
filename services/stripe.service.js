import { config } from "dotenv-safe";
import Stripe from "stripe";
import { getProducts } from "../db/products.db.js";
import BadRequestError from "../errors/bad-request.error.js";

config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const stripe_base_url = "https://api.stripe.com";

const handlePayout = async (cart, user_id) => {
	if(!cart || !cart.length){
		throw new BadRequestError("Nothing in cart.")
	};
	const products = await getProducts();
	const productsMap = new Map();
	products.map((item) => {
		productsMap.set(item.id, {
			name: item.name,
			brand: item.brand,
			description: item.description,
			image: item.image_url,
			price: Math.round(item.price * 100),
		});
	});

	const session = await stripe.checkout.sessions.create({
		line_items: cart.map((item) => {
			const product = productsMap.get(item.product_id);
			return {
				price_data: {
					currency: "ngn",
					product_data: {
						name: product.name,
						description: product.description,
						images: product.image.length > 1 ? [product.image[0], product.image[1]] : [product.image[0]]
					},
					unit_amount: product.price,
				},
				quantity: item.quantity,
			};
		}),
		mode: "payment",
		payment_intent_data:{
			metadata: {
				customerID: user_id,
			},
		},
		success_url: `${process.env.SERVER_URL}/success.html`,
		cancel_url: `${process.env.SERVER_URL}/cancel.html`,
		payment_method_types: ["card"]
	});
	return session;
};

export default handlePayout;
