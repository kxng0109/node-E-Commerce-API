import { findUser } from "../db/auth.db.js";

const findUserFromDB = async(email) =>{
	const user = await findUser(email);
	return user;
}

export default findUserFromDB;