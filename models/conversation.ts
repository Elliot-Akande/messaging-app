import mongoose, { ObjectId } from "mongoose";
import { MessageDocument, MessageInput, messageSchema } from "./message.js";

export interface ConversationInput {
  users: ObjectId[];
  messages: MessageInput[];
}

export interface ConversationDocument
  extends ConversationInput,
    mongoose.Document {
  messages: MessageDocument[];
}

const conversationSchema = new mongoose.Schema({
  users: [{ type: mongoose.Types.ObjectId, ref: "User", required: true }],
  messages: [messageSchema],
});

export default mongoose.model<ConversationDocument>(
  "Conversation",
  conversationSchema
);
