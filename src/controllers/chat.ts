import { NextFunction, Request, Response } from "express";
import Chat from "../models/Chat.js";
import asyncHandler from "express-async-handler";

export const chatsGET = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userID = req.user;
    const chats = Chat.find({ users: userID });
    res.json({ data: chats });
  }
);
