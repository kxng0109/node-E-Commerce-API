import { config } from "dotenv";
import express from "express";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware.js";
import authRoute from "./routes/auth.route.js";
import cartRoute from "./routes/cart.route.js";
import productRoute from "./routes/products.route.js";
import webhookRoute from "./routes/webhook.route.js";
config();

const app = express();
const PORT = process.env.PORT || 3000;

//Mounting here so that the JSON parser middleware (express.json())
//doesn't interfere with it, which is normally does
//stripe required raw, not an object
app.use("/api/v1/webhook", webhookRoute)

app.use(express.json());
app.use(express.static("public"))

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/", productRoute);
app.use("/api/v1/cart", cartRoute);

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
