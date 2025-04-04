import { StatusCodes } from "http-status-codes";
import CustomError from "./customError.error.js";

class UnprocessableEntityError extends CustomError {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
	}
}

export default UnprocessableEntityError;
