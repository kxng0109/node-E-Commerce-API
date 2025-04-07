import { StatusCodes } from "http-status-codes";
import { registerUser } from "../db/auth.db.js";
import {
    ConflictError,
    NotFoundError,
    UnauthorizedError,
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
			throw new UnauthorizedError("Incorrect credentials.");
		}

		const { id, first_name, last_name, email, role } = userDetails;
		const token = await generateJWT({
			id,
			first_name,
			last_name,
			email,
			role,
		});

		sendSuccess(res, StatusCodes.OK, `Welcome ${first_name}`, { token });
	} catch (err) {
		next(err);
	}
};

export const registerController = async (req, res, next) => {
	try {
		const { email, password, first_name, last_name, emailExists, role } =
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
			role,
		);

		const { id } = user;
		const token = await generateJWT({
			id,
			first_name,
			last_name,
			email,
			role,
		});
		const name =
			first_name && last_name ? `${last_name} ${first_name}` : "user";

		sendSuccess(
			res,
			StatusCodes.CREATED,
			`Registeration successful. Welcome ${name}.`,
			{ token },
		);
	} catch (err) {
		next(err);
	}
};
