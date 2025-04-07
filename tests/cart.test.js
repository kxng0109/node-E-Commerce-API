import request from "supertest";
import app from "../app.js";
import pool from "../db/dbConnect.js";
import { createProduct } from "../db/products.db.js";
import { API, SAMPLE_PRODUCT, TEST_USER } from "./helpers/constants.js";
let userToken, product_id;

beforeAll(async () => {
	const res = await request(app).post(API.AUTH_REGISTER).send(TEST_USER);
	userToken = res.body.data.token;

	const { name, brand, description, image_url, price, stock_quantity, available } = SAMPLE_PRODUCT;
	const product = await createProduct(name, brand, description, JSON.stringify(image_url), price, stock_quantity, available);
	product_id = product.id;
});

describe("Cart API", () => {
	it(`POST ${API.CART} should return 201`, async () => {
		const res = await request(app)
			.post(`${API.CART}`)
			.send({
				product_id,
				quantity: 4,
			})
			.set("Authorization", `Bearer ${userToken}`);
		expect(res.statusCode).toBe(201);
	});

	it(`GET ${API.CART} should return 200 and items in the cart`, async () => {
		const res = await request(app)
			.get(`${API.CART}`)
			.set("Authorization", `Bearer ${userToken}`);
		expect(res.statusCode).toBe(200);
	});

	it(`PATCH ${API.CART}/:productID should return 200 and updated items.`, async () => {
		const res = await request(app)
			.patch(`${API.CART}/${product_id}`)
			.send({
				quantity: 6,
			})
			.set("Authorization", `Bearer ${userToken}`);
		expect(res.statusCode).toBe(200);
	});

	it(`DELETE ${API.CART}/:productID should return 200`, async () => {
		const res = await request(app)
			.delete(`${API.CART}/${product_id}`)
			.set("Authorization", `Bearer ${userToken}`);
		expect(res.statusCode).toBe(200);
		expect(res.body.message).toMatch(/removed/);
	});

	it(`DELETE ${API.CART} should return 200 and clear everything in the cart`, async () => {
		const res = await request(app)
			.delete(`${API.CART}`)
			.set("Authorization", `Bearer ${userToken}`);
		expect(res.statusCode).toBe(200);
		expect(res.body.message).toMatch(/cleared/);
	});
});

afterAll(async () => {
	await pool.execute("DELETE FROM users WHERE email = ?", [TEST_USER.email]);
	await pool.execute("DELETE FROM products WHERE id = ?", [product_id]);
	await pool.end();
});
