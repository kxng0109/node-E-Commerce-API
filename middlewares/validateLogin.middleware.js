import validator from "validator";

const validateLogin = async(req, res, next) =>{
	try{
		const {email, password} = req.body;
		if(!email || !password){
			res.send("Required fields can not be empty.")
			throw new Error("Required fields can not be empty.")
		};

		if(!validator.isLength(password, {min: 8})){
			res.send("Password can not be less than eight characters.")
			throw new Error("Password can not be less than eight(8) characters.")
		};

		if(!validator.isEmail(email, {allow_underscores: true})){
			res.send("Invalid email address.")
			throw new Error("Invalid email address.")
		};

		req.user = {email, password};
		next();
	} catch(err){
		next(err);
	}
}

export default validateLogin;