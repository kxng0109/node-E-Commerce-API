import request from "supertest";
import validator from "validator";
import app from "../app.js";
import pool from "../db/dbConnect.js";
import { API, TEST_ADMIN } from "./helpers/constants.js";

const isValidJWT = (jwt) => {
	return validator.isJWT(jwt);
};

describe("Register an admin", () => {
	test(`POST ${API.AUTH_REGISTER} should return 201 and a valid token.`, async () => {
		const res = await request(app).post(API.AUTH_REGISTER).send(TEST_ADMIN);
		expect(res.statusCode).toBe(201);
		expect(res.body.message).toMatch(/successful/);
		expect(isValidJWT(res.body.data.token)).toBeTruthy();
	});
});

describe("Log a user in", () => {
	it(`POST ${API.AUTH_LOGIN} should return 200 and a valid token.`, async () => {
		const { email, password } = TEST_ADMIN;
		const res = await request(app)
			.post(API.AUTH_LOGIN)
			.send({ email, password });
		expect(res.statusCode).toBe(200);
		expect(res.body.message).toMatch(/Welcome/);
		expect(isValidJWT(res.body.data.token)).toBeTruthy();
	});

	it(`POST ${API.AUTH_LOGIN} should return 400 due to wrong credentials.`, async () => {
		const { email } = TEST_ADMIN;
		const res = await request(app).post(API.AUTH_LOGIN).send({
			email,
			password: "random@123",
		});
		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe("Incorrect credentials.");
	});
});

afterAll(async () => {
	await pool.execute("DELETE FROM users WHERE email = ?", [TEST_ADMIN.email]);
	await pool.end();
});
