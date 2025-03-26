import { compare, genSalt, hash } from "bcrypt";

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

export const hashPassword = async(req, res, next) =>{
	try{
		const {password} = req.body;
		const hashedPassword = await hash(password, saltRounds);
		req.user = {hashedPassword};
		next();
	} catch(err){
		next(err);
	}
};

export const comparePassword = async(req, res, next) =>{
	try{
		const {password: givenPassword} = req.body;
		//const fetchedPassword = get from database
		const match = await compare(givenPassword, password);
		if(!match){
			throw new Error("Incorrect credentials");
		}
		next();
	} catch(err){
		next(err);
	}
}