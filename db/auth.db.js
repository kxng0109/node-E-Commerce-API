import pool from "./dbConnect.js";

export const findUser = async(email) =>{
	try{
		const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
		console.log(rows[0])
		return rows[0];
	} catch(err){
		throw new Error(err.message)
	}
}

export const findUserByID = async(id) =>{
	try{
		const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
		return rows[0];
	} catch(err){
		throw new Error(err.message)
	}
}

export const registerUser = async(firstName, lastName, email, password) =>{
	try{
		const [result] = await pool.execute('INSERT INTO users(email, password, first_name, last_name) VALUES(?, ?, ?, ?)', [email, password, firstName, lastName]);
		return findUserByID(result.insertId);
	}catch(err){
		throw new Error(err.message)
	}
}