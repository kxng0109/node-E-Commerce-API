import pool from "./dbConnect.js";

const findUser = async(email) =>{
	try{
		const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
		return rows;
	} catch(err){
		throw new Error(err.message)
	}
}