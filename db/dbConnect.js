import { config } from "dotenv-safe";
import { createPool } from "mysql2/promise";
config();

const pool = createPool({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: "e_commerce",
	supportBigNumbers: true
});

if (!process.env.MYSQL_HOST || !process.env.MYSQL_USER) {
	throw new Error(
		"Invalid SQL credentials. Please ensure the right credentials specified in your .env file.",
	);
}

export default pool;
