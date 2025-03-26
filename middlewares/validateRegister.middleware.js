import validator from "validator";

const validateRegister = async (req, res, next) => {
	try {
		const { email, password, first_name, last_name } = req.body;
		console.log(email, password, first_name, last_name)
		if (!email || !password || !first_name || !last_name) {
			res.send("Required fields can not be empty.")
			throw new Error("Required fields can not be empty.");
		}

		if (!validator.isLength(password, { min: 8 })) {
			res.send("Password can not be less than eight(8) characters.")
			throw new Error(
				"Password can not be less than eight(8) characters.",
			);
		}

		if (!validator.isAlpha(first_name) || !validator.isAlpha(last_name)) {
			res.send("First name and last name can only contain letters.")
			throw new Error(
				"First name and last name can only contain letters.",
			);
		}

		if (
			!validator.isLength(first_name, { min: 3 }) ||
			!validator.isLength(last_name, { min: 3 })
		) {
			res.send("First name and last name can not be less than three(3) characters.")
			throw new Error(
				"First name and last name can not be less than three(3) characters.",
			);
		}

		if (!validator.isEmail(email, { allow_underscores: true })) {
			res.send("Invalid email address.")
			throw new Error("Invalid email address.");
		}

		req.user = { email, password, first_name, last_name };
		next();
	} catch (err) {
		next(err);
	}
};

export default validateRegister;
