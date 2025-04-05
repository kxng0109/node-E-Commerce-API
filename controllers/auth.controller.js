import { StatusCodes } from "http-status-codes";
import { registerUser } from "../db/auth.db.js";
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
} from "../errors/index.js";
import comparePassword from "../utils/comaprePassword.util.js";
import hashPassword from "../utils/hashPassword.util.js";
import sendSuccess from "../utils/response.util.js";
import generateJWT from "../utils/signJWT.util.js";

export const loginController = async (req, res, next) => {
	try {
		const { password, emailExists, userDetails } = req.user; //Gotten from the validateLogin middleware
		if (!emailExists) {
			throw new NotFoundError("User with email not found.");
		}

		const match = await comparePassword(password, userDetails.password);
		if (!match) {
			throw new BadRequestError("Incorrect credentials.");
		}

		const { id, first_name, last_name, email } = userDetails;
		const token = await generateJWT({ id, first_name, last_name, email });

		sendSuccess(res, StatusCodes.OK, `Welcome ${first_name}`, {token});
	} catch (err) {
		next(err);
	}
};

export const registerController = async (req, res, next) => {
	try {
		const { email, password, first_name, last_name, emailExists } =
			req.user; //Gotten from the validateRegister middleware

		if (emailExists) {
			throw new ConflictError("User with this email exists.");
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

		sendSuccess(
			res,
			StatusCodes.CREATED,
			`Registeration successful. Welcome ${last_name} ${first_name}.`,
			token,
		);
	} catch (err) {
		next(err);
	}
};
