import { StatusCodes } from "http-status-codes";
import CustomError from "./customError.error.js";

class BadRequestError extends CustomError {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.BAD_REQUEST;
	}
}

export default BadRequestError;
