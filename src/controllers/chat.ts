import { NextFunction, Request, Response } from "express";
import Chat from "../models/Chat.js";
import asyncHandler from "express-async-handler";
import User, { UserDocument } from "../models/User.js";


export const chatsGET = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument;

    // Get all chats user is part of
    // Exclude logged in user from returned data
    const chats = await Chat.find({ users: user.id }, { users: 1 })
      .populate({
        path: "users",
        match: { _id: { $ne: user.id } },
        select: "username",
      })
      .exec();
    res.json({ data: chats });
  }
);

