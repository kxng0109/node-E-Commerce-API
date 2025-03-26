import { isAlpha, isEmail, isLength } from "validator";

const validateRegister = async (req, res, next) => {
	try {
		const { email, password, first_name, last_name } = req.body;
		if (!email || !password || first_name || last_name) {
			throw new Error("Required fields can not be empty.");
		}

		if (!isLength(password, { min: 8 })) {
			throw new Error(
				"Password can not be less than eight(8) characters.",
			);
		}

		if (!isAlpha(first_name) || !isAlpha(last_name)) {
			throw new Error(
				"First name and last name can only contain letters.",
			);
		}

		if (
			!isLength(first_name, { min: 3 }) ||
			!isLength(last_name, { min: 3 })
		) {
			throw new Error(
				"FIrst name and last name can not be less than three(3) characters.",
			);
		}

		if (!isEmail(email, { allow_underscores: true })) {
			throw new Error("Invalid email address.");
		}

		req.user = { email, password, first_name, last_name };
		next();
	} catch (err) {
		next(err);
	}
};

export default validateRegister;
