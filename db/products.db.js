import BadRequestError from "../errors/bad-request.error.js";
import NotFoundError from "../errors/not-found.error.js";
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

export const getProductByNameAndBrand = async(name, brand) =>{
	try{
		const [rows] = await pool.execute(
			"SELECT * FROM products WHERE name = ? AND brand = ?",
			[name, brand]
		);
		return rows.length ? rows[0] : null;
	} catch(err){
		throw err;
	}
}

export const getProductById = async (product_id) => {
	try {
		const [rows] = await pool.execute(
			"SELECT * FROM products WHERE id = ?",
			[product_id],
		);
		return rows.length ? rows[0] : null;
	} catch(err) {
		throw err;
	}
};

export const createProduct = async (
	name,
	brand,
	description,
	image_url,
	price,
	stock_quantity,
	available,
) => {
	try {
		const [result] = await pool.execute(
			`INSERT INTO products(name, brand, description, image_url, price, stock_quantity, available) 
			VALUES(?, ?, ?, ?, ?, ?, ?)`,
			[
				name,
				brand,
				description,
				image_url,
				price,
				stock_quantity,
				available,
			],
		);
		return result.insertId ? await getProductById(result.insertId) : null;
	} catch (err) {
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
		await pool.execute(`UPDATE products SET available = ? WHERE id =?`, [
			value,
			product_id,
		]);
		return await getProductById(product_id);
	} catch (err) {
		throw err;
	}
};

export const updateProductById = async(fields, product_id) =>{
	try{
		const keys = Object.keys(fields);

		//Let's be sure there's something to be updated.
		if(!keys.length){
			throw new BadRequestError("No fields provided to update.")
		}

		//Let's retrieve the fields from the table.
		const table = await pool.execute("DESCRIBE products");
		const validFields = table[0].map(column => column.Field);

		//Filter the keys that aren't in the database
		const filteredKeys = validFields.filter(field => keys.includes(field));

		//Get the values of the keys we need and are provided with by the user.
		const values = filteredKeys.map(key => fields[key]);

		//Fields we don't want to be updated
		const forbidden = ["id", "created_at", "updated_at"];
		//Now, if the field is includes, throw an error.
		for(const key of filteredKeys){
			if(forbidden.includes(key)){
				throw new BadRequestError(`${key} can not be updated.`)
			}
		};

		//We don't want any empty values
		for (const value of values){
			if(value == ""){
				throw new BadRequestError("Values can not be empty.")
			}
		}

		//Let's build the clause. Let's made it be in the form of 
		//name =?, price =?
		const setClause = filteredKeys.map(key => `${pool.escapeId(key)} = ?`).join(", ");
		//Add the product id to list of values for when we perform a prepared statement
		values.push(product_id);
		const sql = `UPDATE products SET ${setClause} WHERE id = ?`;

		const [result] = await pool.execute(sql, values);
		if(!result.affectedRows){
			throw new NotFoundError(`Product with id ${product_id} not found.`);
		};

		return await getProductById(product_id);
	}catch(err){
		throw err;
	}
}

//Delete a product using its id
export const deleteProductById = async(product_id) =>{
	try{
		const [result] = await pool.execute("DELETE FROM products WHERE id = ?", [product_id]);
		if(!result.affectedRows){
			throw new NotFoundError(`Product with id ${product_id} not found.`)
		};
		return await getProducts();
	}catch(err){
		throw err;
	}
}