import { StatusCodes } from "http-status-codes";
import { CustomError } from "../errors/index.js";

const errorHandlerMiddleware = (err, req, res, next) => {
	if (err instanceof CustomError) {
		return res
			.status(err.statusCode)
			.json({ message: err.message, errCode: err.statusCode });
	}

	console.error(err);
	return res
		.status(StatusCodes.INTERNAL_SERVER_ERROR)
		.json({ message: "An error occured." });
};

export default errorHandlerMiddleware;
