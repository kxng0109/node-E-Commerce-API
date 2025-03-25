import { StatusCodes } from "http-status-codes";
import { getProduct, getProducts } from "../db/products.db.js";

//Get all products
export const viewProducts = async(req, res, err) =>{
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
			next("Product name required", StatusCodes.BAD_REQUEST);
			return;
		};

		const product = await getProduct(productName);
		if(!product){
			// return next("No product found with such name!", StatusCodes.NOT_FOUND)
			res.status(StatusCodes.NOT_FOUND).json("Not found.")
		}
		res.status(StatusCodes.OK).json(product);
	}catch(err){
		next(err)
	}
}