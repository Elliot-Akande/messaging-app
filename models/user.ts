import bcrypt from "bcrypt";
import mongoose from "mongoose";

export interface UserInput {
  username: string;
  password: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  validatePassword: (candidatePassword: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.index({ username: 1 });

userSchema.pre("save", async function (this: UserDocument, next) {
  if (!this.isModified("password")) return next();

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  return next();
});

userSchema.methods.validatePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;
  const isValid = await bcrypt.compare(candidatePassword, user.password);
  return isValid;
};

export default mongoose.model<UserDocument>("User", userSchema);
