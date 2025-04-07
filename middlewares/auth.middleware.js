import jwt from "jsonwebtoken";
import validator from "validator";
import { BadRequestError, UnauthorizedError } from "../errors/index.js";

const authMiddleware = async (req, res, next) => {
	try {
		let authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new UnauthorizedError("No token provided.");
		}

		const token = authHeader.split(" ")[1];
		if (!validator.isJWT(token)) {
			throw new BadRequestError("Invalid token.");
		}

		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET, {
				algorithms: "HS384",
			});
			const { id, email, role } = decoded;
			req.user = { ...req.user, id, email, role };
			next();
		} catch (err) {
			throw new UnauthorizedError(
				"You are not authorized to access this route.",
			);
		}
	} catch (err) {
		next(err);
	}
};

export default authMiddleware;
