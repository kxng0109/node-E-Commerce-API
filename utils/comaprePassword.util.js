import { compare } from "bcrypt";
import { ConflictError } from "../errors/index.js";

const comparePassword = async (givenPassword, hashedPassword) => {
	try {
		const match = await compare(givenPassword, hashedPassword);
		if (!match) {
			throw new ConflictError("Incorrect credentials.");
		}
		return match;
	} catch (err) {
		throw err;;
	}
};

export default comparePassword;