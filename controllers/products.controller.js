import { StatusCodes } from "http-status-codes";
import { getProduct, getProducts } from "../db/products.db.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

//Get all products
export const viewProducts = async(req, res, next) =>{
	try{
		const products = await getProducts();
		res.status(StatusCodes.OK).json(products)
	}catch(err){
		next(err);
	}
}

//Get singular product
export const viewProduct = async(req, res, next) =>{
	try{
		const {productName} = req.params;
		if(!productName){
			throw new BadRequestError("Product name required.")
		};

		const product = await getProduct(productName);
		if(!product){
			throw new NotFoundError("Product with such name not found.")
		}
		res.status(StatusCodes.OK).json(product);
	}catch(err){
		next(err)
	}
}