import mongoose, { ObjectId } from "mongoose";
import { MessageDocument, messageSchema } from "./Message.js";

export interface ChatInput {
  users: ObjectId[];
}

export interface ChatDocument extends ChatInput, mongoose.Document {
  messages: MessageDocument[];
}

const chatSchema = new mongoose.Schema({
  users: [{ type: mongoose.Types.ObjectId, ref: "User", required: true }],
  messages: [messageSchema],
});

export default mongoose.model<ChatDocument>("Chat", chatSchema);
