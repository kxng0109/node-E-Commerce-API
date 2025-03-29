import { StatusCodes } from "http-status-codes";
import { registerUser } from "../db/auth.db.js";
import comparePassword from "../utils/comaprePassword.util.js";
import hashPassword from "../utils/hashPassword.util.js";
import generateJWT from "../utils/signJWT.util.js";

export const loginController = async (req, res, next) => {
	try {
		const { password, emailExists, userDetails } = req.user; //Gotten from the validateLogin middleware
		if (!emailExists) {
			res.send("User with email not found.");
			throw new Error("User with email not found.");
		}

		const match = await comparePassword(password, userDetails.password);
		if (!match) {
			res.send("Incorrect credentials.");
			throw new Error("Incorrect credentials.");
		}

		const { id, first_name, last_name, email } = userDetails;
		const token = await generateJWT({ id, first_name, last_name, email });

		res.status(StatusCodes.OK).json({
			message: `Welcome ${first_name}.`,
			token,
		});
	} catch (err) {
		next(err);
	}
};

export const registerController = async (req, res, next) => {
	try {
		const { email, password, first_name, last_name, emailExists } = req.user; //Gotten from the validateRegister middleware

		if (emailExists) {
			res.send("User with this email exists.");
			throw new Error("User with this email exists.");
		}

		const hashedPassword = await hashPassword(password);
		const user = await registerUser(
			first_name,
			last_name,
			email,
			hashedPassword,
		);

		const { id } = user;
		const token = await generateJWT({ id, first_name, last_name, email });

		res.status(StatusCodes.CREATED).json({
			message: `Registeration successful. Welcome ${last_name} ${first_name}.`,
			token,
		});
	} catch (err) {
		next(err);
	}
};
