import { config } from "dotenv-safe";
import { createPool } from "mysql2/promise";
import pool from "./db/dbConnect.js";
config();

(async () => {
	const {MYSQL_HOST, MYSQL_PASSWORD, MYSQL_USER} = process.env;
	try {
		//Used to create the database if it doesn't exists
		const rootPool = createPool({
			host: MYSQL_HOST,
			user: MYSQL_USER,
			password: MYSQL_PASSWORD,
			supportBigNumbers: true,
			connectionLimit: 5
		});

		await rootPool.query("CREATE DATABASE IF NOT EXISTS e_commerce");
		console.log("Database is ready.")
		await rootPool.end();

		const queries = [
			`
			CREATE TABLE IF NOT EXISTS users (
				id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
				email VARCHAR(255) NOT NULL UNIQUE,
				password VARCHAR(255) NOT NULL,
				first_name VARCHAR(100),
				last_name VARCHAR(100),
				role ENUM('customer', 'admin') DEFAULT 'customer',
				is_verified TINYINT(1) DEFAULT 0,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
			);
			`,
			`
			CREATE TABLE IF NOT EXISTS products (
				id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
				name VARCHAR(255) NOT NULL,
				brand VARCHAR(100) NOT NULL,
				description TEXT NOT NULL,
				image_url JSON NOT NULL,
				price DECIMAL(10,2) NOT NULL,
				stock_quantity INT UNSIGNED DEFAULT 0,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				available ENUM('yes', 'no') DEFAULT 'yes'
			);
			`,
			`
			CREATE TABLE IF NOT EXISTS cart_items (
				id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
				user_id INT UNSIGNED NOT NULL,
				product_id INT UNSIGNED NOT NULL,
				quantity INT UNSIGNED NOT NULL DEFAULT 1,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
				CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id),
				UNIQUE KEY uniq_user_product (user_id, product_id),
				INDEX idx_user_id (user_id),
				INDEX idx_product_id (product_id)
			);
			`,
		];

		for (const query of queries) {
			await pool.execute(query);
		}

		console.log("Database setup completed.");
	} catch (err) {
		console.error("Error setting up database:", err);
	} finally {
		await pool.end();
	}
})();
