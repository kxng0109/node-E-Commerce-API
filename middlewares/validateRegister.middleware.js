import validator from "validator";
import { BadRequestError, UnprocessableEntityError } from "../errors/index.js";

const validateRegister = async (req, res, next) => {
	try {
		const { email, password, first_name, last_name } = req.body;
		if (!email || !password || !first_name || !last_name) {
			throw new BadRequestError("Required fields can not be empty.");
		}

		if (!validator.isLength(password, { min: 8 })) {
			throw new BadRequestError(
				"Password can not be less than eight(8) characters.",
			);
		}

		if(!validator.isStrongPassword(password)){
			throw new UnprocessableEntityError("Password must contain at least one uppercase letter, one lowercase letter, one symbol and must not be less than eight (8) characters");
		}

		if (!validator.isAlpha(first_name) || !validator.isAlpha(last_name)) {
			throw new BadRequestError(
				"First name and last name can only contain letters.",
			);
		}

		if (
			!validator.isLength(first_name, { min: 3 }) ||
			!validator.isLength(last_name, { min: 3 })
		) {
			throw new BadRequestError(
				"First name and last name can not be less than three(3) characters.",
			);
		}

		if (!validator.isEmail(email, { allow_underscores: true })) {
			throw new BadRequestError("Invalid email address.");
		}

		req.user = { email, password, first_name, last_name };
		next();
	} catch (err) {
		next(err);
	}
};

export default validateRegister;
