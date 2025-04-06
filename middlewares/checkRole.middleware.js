import { ForbiddenError } from "../errors/index.js";

const checkRole = async (req, res, next) => {
	try {
		const { role } = req.user;
		if (role !== "admin") {
			throw new ForbiddenError(
				"You don't have permission to access this route.",
			);
		}
		next();
	} catch (err) {
		next(err);
	}
};

export default checkRole;
