import { config } from "dotenv-safe";
import app from "./app.js";
config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
