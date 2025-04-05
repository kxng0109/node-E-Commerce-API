import { StatusCodes } from "http-status-codes";
import validator from "validator";
import { getProduct, getProductById, getProducts } from "../db/products.db.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import sendSuccess from "../utils/response.util.js";

//Get all products
export const viewProducts = async(req, res, next) =>{
	try{
		const products = await getProducts();
		if(!products || !products.length){
			throw new NotFoundError("No products found in the database.")
		}
		sendSuccess(res, StatusCodes.OK, "Successfully retrieved products", {products})
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

		if(!validator.isAlphanumeric(productName)){
			throw new BadRequestError("Product name must be an alphabet or a number indicating its id");
		}

		let product;
		if(Number.isNaN(Number(productName))){
			product = await getProduct(productName);
		}else{
			product = await getProductById(productName);
		}
		if(!product){
			throw new NotFoundError("Product with such name not found.")
		}
		sendSuccess(res, StatusCodes.OK, "Successfully retrieved product.", {product})
	}catch(err){
		next(err)
	}
}