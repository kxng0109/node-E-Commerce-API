import { getProductById } from "../db/products.db.js";

const checkProductExists = async(product_id) =>{
	const check = await getProductById(product_id);
	if(!check)return false;
	return true;
}

export default checkProductExists;