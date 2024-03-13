import express from "express";
import {
  createChat,
  createMessage,
  getChat,
  getUserChats,
} from "../controllers/chat.js";

const router = express.Router();

router.get("/:chatId", getChat);
router.get("/", getUserChats);

router.post("/:chatId", createMessage);
router.post("/", createChat);

export default router;
