import pool from "./dbConnect.js";

export const checkCart = async (cart_name) => {
	try {
		//Apparently, placeholders in prepared statements work well for values, but they won't work for table names or column names
		const escapedTableName = pool.escape(cart_name);
		const query = `SHOW TABLES LIKE ${escapedTableName}`;
		const [rows] = await pool.execute(query);
		// console.log(rows)
		return rows.length ? true : false;
	} catch (err) {
		// console.log(err)
		throw new Error(err);
	}
};

export const createCart = async (cart_name) => {
	try {
		const table = pool.escapeId(cart_name);
		console.log(table)
		const query = `
		CREATE TABLE ${table} (
		id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    	user_id INT UNSIGNED NOT NULL,
		product_id INT UNSIGNED NOT NULL,
		quantity INT UNSIGNED NOT NULL DEFAULT 1,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
		CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id),
		INDEX idx_user_id (user_id),
		INDEX idx_product_id (product_id)
			);`
		const [result] = await pool.execute(query);
		console.log(result);
		return checkCart(cart_name);
	} catch (err) {
		throw new Error(err);
	}
};

//Check if the item is actually in the cart
export const findItemInCart = async(cart_name, product_id) =>{
	try {
		//Apparently, placeholders in prepared statements work well for values, but they won't work for table names or column names
		const table = pool.escapeId(cart_name);
		const query = `SELECT product_id FROM ${table} WHERE product_id = ?`;

		const [rows] = await pool.execute(query, [product_id]);
		return rows.length ? rows[0] : null;
	} catch (err) {
		throw new Error(err);
	}
};

export const getCartItemProperty = async (key, cart_name, product_id) => {
	try {
		const result = await findItemInCart(cart_name, product_id);
		return result ? result[key] : null;
	} catch (err) {
		throw new Error(err);
	}
};

export const addToCart = async (cart_name, product_id, quantity) => {
	try {
		const table = pool.escapeId(cart_name);
		const query = `INSERT INTO ${table} (product_id, quantity) VALUES(?, ?)`;
		const [result] = await pool.execute(query, [
			product_id,
			quantity
		]);
		return result;
	} catch (err) {
		throw new Error(err);
	}
};

export const incrementItemQuantity = async (cart_name, product_id) => {
	try {
		const [result] = await pool.execute(
			"UPDATE ? SET quantity=quantity + 1 WHERE product_id = ?",
			[cart_name, product_id],
		);
		return result;
	} catch (err) {
		throw new Error(err);
	}
};

export const decrementItemQuantity = async (cart_name, product_id) => {
	try {
		const [result] = await pool.execute(
			"UPDATE ? SET quantity=quantity - 1 WHERE product_id = ?",
			[cart_name, product_id],
		);
		return result;
	} catch (err) {
		throw new Error(err);
	}
};

export const deleteItemFromCart = async (cart_name, product_id) => {
	try {
		const [result] = await pool.execute(
			"DELETE FROM ? WHERE product_id = ?",
			[cart_name, product_id],
		);
		return result;
	} catch (err) {
		throw new Error(err);
	}
};

export const clearCart = async (cart_name) => {
	try {
		const [result] = await pool.execute("DELETE FROM ?", [cart_name]);
		return result;
	} catch (err) {
		throw new Error(err);
	}
};
