import { Router, raw } from "express";
import webhookController from "../controllers/webhook.controller.js";

const router = Router();

router.post("/stripe", raw({ type: "application/json" }), webhookController);

export default router;
