import express from "express";
import { chatsGET, chatsPOST } from "../controllers/chat.js";

const router = express.Router();

router.get("/", chatsGET);
router.post("/", chatsPOST);

export default router;
