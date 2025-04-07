import { StatusCodes } from "http-status-codes";
import validator from "validator";
import { createProduct, deleteProductById, getProduct, getProductById, getProductByNameAndBrand, getProducts, updateProductById } from "../db/products.db.js";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "../errors/index.js";
import sendSuccess from "../utils/response.util.js";

//Get all products
export const viewProducts = async(req, res, next) =>{
	try{
		const products = await getProducts();
		if(!products || !products.length){
			return sendSuccess(res, StatusCodes.OK, "No products found in the database.")
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

		let product;
		if(Number.isNaN(Number(productName))){
			product = await getProduct(productName);
		}else{
			product = await getProductById(productName);
		}
		if(!product){
			throw new NotFoundError("Product with such name or ID not found.")
		}
		sendSuccess(res, StatusCodes.OK, "Successfully retrieved product.", {product})
	}catch(err){
		next(err)
	}
}

export const addProduct = async(req, res, next) =>{
	try{
		const { name, brand, description, image_url, price, stock_quantity, available} = req.body;

		if(!name || !brand || !description || !image_url || !price || !stock_quantity || !available){
			throw new BadRequestError("Required fields can't be empty or non-existent.")
		}
		const images = JSON.stringify(image_url);

		const product = await getProductByNameAndBrand(name, brand);

		if(product && product.name == name && product.brand == brand){
			throw new ConflictError("Product exists in the database.")
		}

		const newProduct = await createProduct(name, brand, description, images, price, stock_quantity, available);
		if(!newProduct){
			throw new Error("Error occured while creating product.")
		}
		sendSuccess(res, StatusCodes.CREATED, "Product added to database.", {newProduct});
	}catch(err){
		next(err);
	}
}

export const updateProduct = async(req, res, next) =>{
	try{
		const {productID} = req.user;
		if(!productID){
			throw new BadRequestError("Product ID needed.")
		}
		const product = await updateProductById(req.body, productID);

		sendSuccess(res, StatusCodes.OK, "Product updated Successfully.", {product})
	}catch(err){
		next(err)
	}
}

export const deleteProduct = async(req, res, next) =>{
	try{
		const { productID } = req.user;
		if(!productID){
			throw new BadRequestError("Product ID needed.")
		}

		const products = await deleteProductById(productID);
		sendSuccess(res, StatusCodes.OK, "Product removed from database.", {products});
	}catch(err){
		next(err)
	}
}