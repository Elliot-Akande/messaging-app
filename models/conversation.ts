import mongoose, { ObjectId } from "mongoose";
import { MessageDocument } from "./message.js";
import Message from "./message.js";

export interface ConversationInput {
  users: ObjectId[];
  messages: MessageDocument[];
}

export interface ConversationDocument
  extends ConversationInput,
    mongoose.Document {}

const conversationSchema = new mongoose.Schema({
  users: [{ type: mongoose.Types.ObjectId, ref: "User", required: true }],
  messages: [Message],
});

export default mongoose.model<ConversationDocument>(
  "Conversation",
  conversationSchema
);
