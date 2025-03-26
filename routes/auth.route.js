import { Router } from "express";
import { loginController, registerController } from "../controllers/auth.controller.js";
import checkUserExist from "../middlewares/checkUserExist.middleware.js";
import validateLogin from "../middlewares/validateLogin.middleware.js";
import validateRegister from "../middlewares/validateRegister.middleware.js";

const router = Router();

router.post("/login", validateLogin, checkUserExist, loginController)
router.post("/register", validateRegister, checkUserExist, registerController)

export default router;