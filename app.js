import { config } from "dotenv";
import express from "express";
import productRoute from "./routes/products.route.js";
config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/v1/")
app.use("/api/v1/", productRoute);

app.use((err, req, res, next) =>{
	console.error(err.stack);
	console.log(err)
	res.status(500).send()
})

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
