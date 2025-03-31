import pool from "./dbConnect.js";

export const checkTable = async () => {
	try {
		const [rows] = await pool.execute('SHOW TABLES LIKE cart_items');
		return rows.length ? true : false;
	} catch (err) {
		throw new Error(err);
	}
};

export const createCart = async () => {
	try {
		const [result] = await pool.execute(`
			CREATE TABLE cart_items (
			id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	    	user_id INT UNSIGNED NOT NULL,
			product_id INT UNSIGNED NOT NULL,
			quantity INT UNSIGNED NOT NULL DEFAULT 1,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
			CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id),
			UNIQUE KEY uniq_user_product (user_id, product_id),
			INDEX idx_user_id (user_id),
			INDEX idx_product_id (product_id)
			`);
		console.log(result);
		return checkCart(cart_name);
	} catch (err) {
		throw new Error(err);
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
		throw new Error(err);
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
		throw new Error(err);
	}
};

//Check product in user's cart
export const getProductFromCart = async(product_id, user_id) =>{
	try {
		const [rows] = await pool.execute(
			`SELECT * FROM cart_items WHERE product_id = ? AND user_id = ?`,
			[product_id, user_id],
		);
		return rows.length ? rows[0] : null;
	} catch (err) {
		throw new Error(err);
	}
}

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
		throw new Error(err);
	}
};

export const updateItemInCart = async(user_id, product_id, quantity) =>{
	try{
		const [result] = await pool.execute("UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?", [quantity, user_id, product_id]);
		return result.affectedRows ? await getProductFromCart(product_id, user_id) : null;
	}catch(err){
		throw new Error(err);
	}
}

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
		throw new Error(err);
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
		throw new Error(err);
	}
};
