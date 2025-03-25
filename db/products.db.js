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
		return rows[0];
	} catch(err){
		return err;
	}
}