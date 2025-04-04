import pool from "./dbConnect.js";

//Get all products
export const getProducts = async () => {
	try {
		const [rows] = await pool.execute("SELECT * FROM products");
		return rows;
	} catch (err) {
		throw err;
	}
};

//Get a product
export const getProduct = async (name) => {
	try {
		const [rows] = await pool.execute(
			"SELECT * FROM products WHERE name = ?",
			[name],
		);
		return rows.length ? rows[0] : null;
	} catch (err) {
		throw err;
	}
};

export const getProductById = async (product_id) => {
	try {
		const [rows] = await pool.execute(
			"SELECT * FROM products WHERE id = ?",
			[product_id],
		);
		return rows.length ? rows[0] : null;
	} catch {
		throw err;
	}
};

//Update the stock quantity
export const updateProductQuantityById = async (key, value, product_id) => {
	try {
		const column = pool.escapeId(key);
		await pool.execute(
			`UPDATE products SET stock_quantity = ? WHERE id =?`,
			[value, product_id],
		);
		return await getProductById(product_id);
	} catch (err) {
		throw err;
	}
};

//Update the product's availablility
//Used when the product stcok quantity is 0, or the product just got restocked after being out of stock
export const updateProductAvailabilityById = async (value, product_id) => {
	try {
		const column = pool.escapeId(key);
		await pool.execute(
			`UPDATE products SET available = ? WHERE id =?`,
			[value, product_id],
		);
		return await getProductById(product_id);
	} catch (err) {
		throw err;
	}
};
