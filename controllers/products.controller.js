import { StatusCodes } from "http-status-codes";
import validator from "validator";
import { createProduct, getProduct, getProductById, getProducts } from "../db/products.db.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "../errors/index.js";
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

export const addProduct = async(req, res, next) =>{
	try{
		const { name, brand, description, image_url, price, stock_quantity, available} = req.body;
		const {role} = req.user;
		if(role !== "admin"){
			throw new ForbiddenError("You don't have permission to access this route.");
		}

		if(!name || !brand || !description || !image_url || !price || !stock_quantity || !available){
			throw new BadRequestError("Required fields can't be empty or non-existent.")
		}

		const product = await createProduct(name, brand, description, image_url, price, stock_quantity, available);
		if(!product){
			throw new Error("Error occured while creating product.")
		}
		sendSuccess(res, StatusCodes.CREATED, "Product added to database.", {product});
	}catch(err){
		next(err);
	}
}