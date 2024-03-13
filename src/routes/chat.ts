import express from "express";
import { createChat, getUserChats } from "../controllers/chat.js";

const router = express.Router();

router.get("/", getUserChats);
router.post("/", createChat);

export default router;
