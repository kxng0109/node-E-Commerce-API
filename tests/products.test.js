import request from "supertest";
import app from "../app.js";
import pool from "../db/dbConnect.js";
import { getProductByNameAndBrand } from "../db/products.db.js";
import { API, SAMPLE_PRODUCT, TEST_ADMIN } from "./helpers/constants.js";

let adminToken;

beforeAll(async () => {
	const res = await request(app).post(API.AUTH_REGISTER).send(TEST_ADMIN);
	adminToken = res.body.data.token;
});

describe("Product API", () => {
	it(`GET ${API.PRODUCTS} should return 200 and an array`, async () => {
		const res = await request(app).get(API.PRODUCTS);
		expect(res.statusCode).toBe(200);
	});

	describe(`POST ${API.PRODUCT}`, () => {
		it(`POST ${API.PRODUCT} (no auth) should return 401`, async () => {
			const res = await request(app)
				.post(API.PRODUCT)
				.send(SAMPLE_PRODUCT);
			expect(res.statusCode).toBe(401);
			expect(res.body.message).toMatch(/token/);
		});

		it(`POST ${API.PRODUCT} with auth should return 201`, async () => {
			const res = await request(app)
				.post(API.PRODUCT)
				.send(SAMPLE_PRODUCT)
				.set("Authorization", `Bearer ${adminToken}`);
			expect(res.statusCode).toBe(201);
			expect(res.body.message).toMatch(/added/);
			expect(res.body.data.newProduct).toHaveProperty("id");
		});
	});

	it(`PATCH ${API.PRODUCT}:productID should return 200`, async () => {
		const product = await getProductByNameAndBrand(
			SAMPLE_PRODUCT.name,
			SAMPLE_PRODUCT.brand,
		);
		const productID = product.id;
		const res = await request(app)
			.patch(`${API.PRODUCT}${productID}`)
			.send({
				stock_quantity: 24,
				available: "yes",
			})
			.set("Authorization", `Bearer ${adminToken}`);
		expect(res.statusCode).toBe(200);
		expect(res.body.message).toMatch(/updated/);
		expect(res.body.data.product).toHaveProperty("id");
	});

	it(`DELETE ${API.PRODUCT}:productID should return 200`, async () => {
		const product = await getProductByNameAndBrand(
			SAMPLE_PRODUCT.name,
			SAMPLE_PRODUCT.brand,
		);
		const productID = product.id;
		const res = await request(app)
			.delete(`${API.PRODUCT}${productID}`)
			.set("Authorization", `Bearer ${adminToken}`);
		expect(res.statusCode).toBe(200);
		expect(res.body.message).toMatch(/removed/);
	});
});

afterAll(async () => {
	await pool.execute("DELETE FROM users WHERE email = ?", [TEST_ADMIN.email]);
	await pool.end();
});
