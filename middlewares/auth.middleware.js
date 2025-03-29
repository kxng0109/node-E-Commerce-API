import jwt from "jsonwebtoken";
import validator from "validator";

const authMiddleware = async (req, res, next) => {
	let authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new Error("No token provided");
	}

	const token = authHeader.split(" ")[1];
	if (!validator.isJWT(token)) {
		throw new Error("Invalid token.");
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET, {algorithms: "HS384"});
		const { id, email } = decoded;
		req.user = { ...req.user, id, email };
		next();
	} catch (err) {
		throw new Error("You are not authorized to access this route.");
	}
};

export default authMiddleware;
