import { StatusCodes } from "http-status-codes";
import { CustomError } from "../errors/index.js";

const errorHandlerMiddleware = (err, req, res, next) => {
	if (err instanceof CustomError) {
		return res.status(err.statusCode).json({
			success: false,
			message: err.message,
			errCode: err.statusCode,
		});
	}

	console.error(err);

	if (err.sqlMessage) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: err.sqlMessage,
			errCode: `${StatusCodes.INTERNAL_SERVER_ERROR} - ${err.code}`,
		});
	}
	
	if (
		err.message.includes("doesn't exist") &&
		err.message.includes("Table")
	) {
		return res.status(StatusCodes.NOT_FOUND).json({
			success: false,
			message: "Table does not exist in database.",
			errCode: StatusCodes.NOT_FOUND,
		});
	}
	return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
		success: false,
		message: "An error occured.",
		errCode: StatusCodes.INTERNAL_SERVER_ERROR,
	});
};

export default errorHandlerMiddleware;
