import mongoose, { ObjectId } from "mongoose";

export interface MessageInput {
  content: string;
  author: ObjectId;
}

export interface MessageDocument extends MessageInput, mongoose.Document {
  createdAt: Date;
}

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model<MessageDocument>("Message", messageSchema);
