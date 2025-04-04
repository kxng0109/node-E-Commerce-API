import { getProductById, updateProductAvailabilityById, updateProductQuantityById } from "../db/products.db.js";

const updateTable = async (productID, purchaseQuantity) => {
	const product = await getProductById(productID);
	const availableStock = Number(product.stock_quantity);
	const stockAfterPurchase = availableStock - Number(purchaseQuantity);

	switch (true) {
		case stockAfterPurchase > 1:
			await updateProductQuantityById(
				"stock_quantity",
				stockAfterPurchase,
				productID,
			);
			break;
		case stockAfterPurchase === 0:
			await updateProductQuantityById(
				"stock_quantity",
				stockAfterPurchase,
				productID,
			);
			await updateProductAvailabilityById("available", "no", productID);
			break;
	}
};

export default updateTable;
