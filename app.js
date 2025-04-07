import cors from "cors";
import { config } from "dotenv-safe";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware.js";
import authRoute from "./routes/auth.route.js";
import cartRoute from "./routes/cart.route.js";
import productRoute from "./routes/products.route.js";
import webhookRoute from "./routes/webhook.route.js";
config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(
	rateLimit({
		windowMs: 5 * 60 * 1000,
		limit: 50,
		message: "You've reached your limit for request.",
	}),
);
app.use(hpp());
app.use(express.static("public"));

const swaggerDocs = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

//Mounting here so that the JSON parser middleware (express.json())
//doesn't interfere with it, which is normally does
//stripe required raw, not an object
app.use("/api/v1/webhook", webhookRoute);
app.use(express.json());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/", productRoute);
app.use("/api/v1/cart", cartRoute);

app.use(errorHandlerMiddleware);

export default app;
