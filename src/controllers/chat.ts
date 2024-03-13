import { JSONSchemaType } from "ajv";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import validateBody from "../middleware/validateBody.js";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User, { UserDocument } from "../models/User.js";
import { ObjectId } from "mongoose";

interface UserIDs {
  users: string[];
}

interface Message {
  message: string;
}

const userSchema: JSONSchemaType<UserIDs> = {
  type: "object",
  properties: {
    users: { type: "array", items: { type: "string" } },
  },
  required: ["users"],
  additionalProperties: false,
};

const messageSchema: JSONSchemaType<Message> = {
  type: "object",
  properties: {
    message: { type: "string" },
  },
  required: ["message"],
  additionalProperties: false,
};

// GET all Chats User is part of
export const getUserChats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument;

    // Get all chats user is part of
    // Exclude logged in user from returned data
    const chats = await Chat.find({ users: user._id }, { users: 1 })
      .populate({
        path: "users",
        match: { _id: { $ne: user._id } },
        select: "username",
      })
      .exec();
    res.json({ data: chats });
  }
);

// GET specified Chat
export const getChat = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const chat = await Chat.findById(req.params.chatId)
      .populate("users", "username")
      .exec();
    if (!chat) {
      return next(createHttpError("404", "Chat not found"));
    }

    // Check User is part of Chat
    const user = req.user as UserDocument;
    const chatUsers = chat.users as unknown as Array<{
      _id: ObjectId;
      username: string;
    }>;
    if (
      !chatUsers.some(
        (chatUser) => chatUser._id.toString() === user._id.toString()
      )
    ) {
      return next(createHttpError(403));
    }

    // Remove current User data from Users
    const filtered = chatUsers.filter(
      (chatUser) => chatUser._id.toString() !== user._id.toString()
    );

    res.json({
      data: {
        _id: chat.id,
        users: filtered,
        messages: chat.messages,
      },
    });
  }
);

// POST request to create new chat
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

// POST request to create new message
export const createMessage = [
  validateBody(messageSchema),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const chat = await Chat.findById(req.params.chatId).exec();
    if (!chat) {
      return next(createHttpError(404, "Chat not found"));
    }

    // Check User is part of Chat
    const user = req.user as UserDocument;
    if (!chat.users.includes(user._id)) {
      return next(createHttpError(403));
    }

    const message = await chat.createMessage(req.body.message, user._id);

    res.json({
      data: message,
    });
  }),
];
