import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMessage, sendMessage } from "../controllers/message.controller.js";

const router = Router();

router.route("/send/:id").post(verifyJWT, sendMessage);
router.route("/getAll/:id").post(verifyJWT, getMessage);

export default router;
