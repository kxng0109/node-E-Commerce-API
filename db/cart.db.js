import pool from "./dbConnect.js";

const checkTable = async () => {
	try {
		const [rows] = await pool.execute("SHOW TABLES LIKE cart_items");
		return rows.length ? true : false;
	} catch (err) {
		throw err;
	}
};

//Get everything in the user's cart
export const getUserCart = async (user_id) => {
	try {
		const [rows] = await pool.execute(
			`SELECT * FROM cart_items WHERE user_id = ?`,
			[user_id],
		);
		return rows.length ? rows : null;
	} catch (err) {
		throw err;
	}
};

//Get specific thing in users cart. It's an internal function
const getUserItemInCart = async (cart_id) => {
	try {
		const [rows] = await pool.execute(
			`SELECT * FROM cart_items WHERE id = ?`,
			[cart_id],
		);
		return rows[0];
	} catch (err) {
		throw err;
	}
};

//Check product in user's cart
export const getProductFromCart = async (product_id, user_id) => {
	try {
		const [rows] = await pool.execute(
			`SELECT * FROM cart_items WHERE product_id = ? AND user_id = ?`,
			[product_id, user_id],
		);
		return rows.length ? rows[0] : null;
	} catch (err) {
		throw err;
	}
};

//Yeah
export const addItemToCart = async (user_id, product_id, quantity) => {
	try {
		const [result] = await pool.execute(
			`INSERT INTO cart_items(user_id, product_id, quantity) VALUES(?, ?, ?)`,
			[user_id, product_id, quantity],
		);
		const row = await getUserItemInCart(result.insertId);
		return row;
	} catch (err) {
		throw err;
	}
};

export const updateItemInCart = async (user_id, product_id, quantity) => {
	try {
		const [result] = await pool.execute(
			"UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?",
			[quantity, user_id, product_id],
		);
		return result.affectedRows
			? await getProductFromCart(product_id, user_id)
			: null;
	} catch (err) {
		throw err;
	}
};

//Delete an item from the user cart
export const deleteFromCart = async (product_id, user_id) => {
	try {
		await pool.execute(
			"DELETE FROM cart_items WHERE product_id = ? AND user_id = ?",
			[product_id, user_id],
		);
		const rows = await getUserCart(user_id);
		return rows;
	} catch (err) {
		throw err;
	}
};

//Delete everything in the user's cart
export const clearCart = async (user_id) => {
	try {
		await pool.execute("DELETE FROM cart_items WHERE user_id = ?", [
			user_id,
		]);
		return true;
	} catch (err) {
		throw err;
	}
};
