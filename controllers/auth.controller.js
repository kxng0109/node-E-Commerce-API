import { StatusCodes } from "http-status-codes";
import { findUser } from "../db/auth.db.js";
import findUserFromDB from "../utils/findUserUtil.js";


export const logIn = async(req, res, next) =>{
	try{
		res.status(StatusCodes.OK).json({message: "Welcome"})
	}catch(err){
		next(err)
	}
}