import { compare } from "bcrypt";

const comparePassword = async (givenPassword, hashedPassword) => {
	try {
		const match = await compare(givenPassword, hashedPassword);
		if (!match) {
			throw new Error("Incorrect credentials. ");
		}
		return match;
	} catch (err) {
		throw new Error(err);
	}
};

export default comparePassword;