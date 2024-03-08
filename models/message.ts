import mongoose, { ObjectId } from "mongoose";

export interface MessageInput {
  content: string;
  author: ObjectId;
}

export interface MessageDocument extends MessageInput, mongoose.Document {
  createdAt: Date;
}

export const messageSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);
