import pool from "./dbConnect.js";

//Get all products
export const getProducts = async() =>{
	try{
		const [rows] = await pool.execute('SELECT * FROM products');
		return rows;
	} catch(err){
		return err;
	}
}

//Get a product
export const getProduct = async(name) =>{
	try{
		const [rows] = await pool.execute('SELECT * FROM products WHERE name = ?', [name]);
		return rows.length ? rows[0] : null;
	} catch(err){
		return err;
	}
}

export const getProductById = async(product_id) =>{
	try{
		const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [product_id]);
		return rows.length ? rows[0] : null;
	}catch{
		return err;
	}
}