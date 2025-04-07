import { compare } from "bcrypt";
import { UnauthorizedError } from "../errors/index.js";

const comparePassword = async (givenPassword, hashedPassword) => {
	try {
		const match = await compare(givenPassword, hashedPassword);
		if (!match) {
			throw new UnauthorizedError("Incorrect credentials.");
		}
		return match;
	} catch (err) {
		throw err;
	}
};

export default comparePassword;
