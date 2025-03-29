import { config } from "dotenv";
import express from "express";
import authRoute from "./routes/auth.route.js";
import cartRoute from "./routes/cart.route.js";
import productRoute from "./routes/products.route.js";
config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/", productRoute);
app.use("/api/v1/cart", cartRoute);

app.use((err, req, res, next) =>{
	console.error(err.stack);
	console.log(err)
	res.status(500).json(err)
})

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
