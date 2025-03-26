import findUserFromDB from "../utils/findUserUtil.js";

const checkUserExist = async (req, _res, next) => {
	try {
		const {email} = req.user; //Gotten from validateLogin or vadlidateRegister middleware
		const user = await findUserFromDB(email);
		if (!user || !user.email) {
			req.user = { ...req.user, emailExists: false };
			next();
			return;
		}

		req.user = { ...req.user, emailExists: true, userDetails: user };
		next();
	} catch (err) {
		next(err);
	}
};

export default checkUserExist;
