import mongoose, { ObjectId } from "mongoose";
import Message, { MessageDocument, messageSchema } from "./Message.js";

export interface ChatInput {
  users: ObjectId[];
}

export interface ChatDocument extends ChatInput, mongoose.Document {
  messages: MessageDocument[];
  createMessage: (message: string, author: ObjectId) => Promise<string>;
}

const chatSchema = new mongoose.Schema({
  users: [{ type: mongoose.Types.ObjectId, ref: "User", required: true }],
  messages: [messageSchema],
});

chatSchema.methods.createMessage = async function (
  content: string,
  author: ObjectId
): Promise<MessageDocument> {
  const chat = this as ChatDocument;
  const message = new Message({
    content,
    author,
  });
  chat.messages.push(message);
  await chat.save();

  return message;
};

export default mongoose.model<ChatDocument>("Chat", chatSchema);
