import { hash } from "bcrypt";
import { config } from "dotenv-safe";
config();

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

const hashPassword = async(rawPassword) =>{
	try{
		const hashedPassword = await hash(rawPassword, saltRounds);
		return hashedPassword;
	} catch(err){
		throw new Error(err)
	}
};

export default hashPassword;