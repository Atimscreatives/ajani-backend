import express from "express";
import { aichatController } from "../controllers/aichat.controller.js";

const router = express.Router();

router.post("/message", aichatController);

export default router;
