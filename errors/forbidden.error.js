import { StatusCodes } from "http-status-codes";
import CustomError from "./customError.error.js";

class ForbiddenError extends CustomError{
	constructor(message){
		super(message);
		this.statusCode = StatusCodes.FORBIDDEN
	}
}

export default ForbiddenError;