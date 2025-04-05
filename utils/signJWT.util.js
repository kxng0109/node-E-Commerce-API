import { config } from "dotenv-safe";
import jwt from "jsonwebtoken";
config();

const JWTSecret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN || "2d";

const generateJWT = async (payload) => {
	const token = jwt.sign(payload, JWTSecret, { algorithm: "HS384", expiresIn });
	return token;
};

export default generateJWT;
