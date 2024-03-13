import { NextFunction, Request, Response } from "express";
import Chat from "../models/Chat.js";
import asyncHandler from "express-async-handler";
import { JSONSchemaType } from "ajv";
import validateBody from "../middleware/validateBody.js";
import User, { UserDocument } from "../models/User.js";
import createHttpError from "http-errors";

interface UserIDs {
  users: string[];
}

const userSchema: JSONSchemaType<UserIDs> = {
  type: "object",
  properties: {
    users: { type: "array", items: { type: "string" } },
  },
  required: ["users"],
  additionalProperties: false,
};

export const getUserChats = asyncHandler(
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

export const createChat = [
  validateBody(userSchema),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userIDs = req.body.users;

    const users = await Promise.all<UserDocument>(
      userIDs.map(async (id: string): Promise<UserDocument> => {
        const user = await User.findById(id).exec();
        if (!user) throw createHttpError(404, `User with ID ${id} not found`);
        return user;
      })
    );

    // User is authenticated in app.ts
    // Passport deserializes ID to UserDocument
    users.push(req.user as UserDocument);

    const chat = await Chat.create({ users });

    res.status(201).json({ data: chat.id });
  }),
];
