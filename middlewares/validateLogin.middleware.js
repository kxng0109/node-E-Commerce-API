import { isEmail, isLength } from "validator";

const validateLogin = async(req, res, next) =>{
	try{
		const {email, password} = req.body;
		if(!email || !password){
			throw new Error("Required fields can not be empty.")
		};

		if(!isLength(password, {min: 8})){
			throw new Error("Password can not be less than eight characters.")
		};

		if(!isEmail(email, {allow_underscores: true})){
			throw new Error("Invalid email address.")
		};
		
		const user = findUserFromDB(email);
		if(!user || !user.length){
			throw new Error("User with email not found.")
		}

		req.user = {email, password};
		next();
	} catch(err){
		next(err);
	}
}

export default validateLogin;