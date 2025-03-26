import pool from "./dbConnect.js";

export const findUser = async(email) =>{
	try{
		const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
		return rows;
	} catch(err){
		throw new Error(err.message)
	}
}

export const registerUser = async(firstName, lastName, email, password) =>{
	try{
		const [result] = await pool.execute('INSERT INTO users(email, password, first_name, last_name) VALUES(?, ?, ?, ?)', [email, password, firstName, lastName]);
		return result;
	}catch(err){
		throw new Error(err.message)
	}
}