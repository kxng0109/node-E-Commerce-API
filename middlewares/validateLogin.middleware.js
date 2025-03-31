import validator from "validator";
import { BadRequestError } from "../errors/index.js";

const validateLogin = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			throw new BadRequestError("Required fields can not be empty.");
		}

		if (!validator.isLength(password, { min: 8 })) {
			throw new BadRequestError(
				"Password can not be less than eight(8) characters.",
			);
		}

		if (!validator.isEmail(email, { allow_underscores: true })) {
			throw new BadRequestError("Invalid email address.");
		}

		req.user = { email, password };
		next();
	} catch (err) {
		next(err);
	}
};

export default validateLogin;
