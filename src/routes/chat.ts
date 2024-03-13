import express from "express";
import Chat from "../models/Chat.js";
import { chatsGET } from "../controllers/chat.js";

const router = express.Router();

router.get("/", chatsGET);

export default router;
