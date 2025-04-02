import { config } from "dotenv";
import Stripe from "stripe";
import { getProducts } from "../db/products.db.js";

config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const stripe_base_url = "https://api.stripe.com";

const handlePayout = async (cart) => {
	const products = await getProducts();
	const productsMap = new Map();
	products.map((item) => {
		productsMap.set(item.id, {
			name: item.name,
			brand: item.brand,
			description: item.description,
			price: Math.round(item.price * 100),
		});
	});

	const session = await stripe.checkout.sessions.create({
		line_items: cart.map((item) => {
			const product = productsMap.get(item.product_id);
			console.log(product.price)
			return {
				price_data: {
					currency: "NGN",
					product_data: {
						name: product.name,
						description: product.description || "test",
						images: product.image_url
							? [product.image_url]
							: ["test"],
					},
					unit_amount: product.price,
				},
				quantity: item.quantity,
			};
		}),
		mode: "payment",
		success_url: `http://localhost:3000/success.html`,
		payment_method_types: ["card"]
	});
	return session;
};

export default handlePayout;
