import { JSONSchemaType } from "ajv";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import passport from "passport";
import validateBody from "../middleware/validateBody.js";
import User, { UserInput } from "../models/User.js";

// Used for req body validation with ajv
const userSchema: JSONSchemaType<UserInput> = {
  type: "object",
  properties: {
    username: { type: "string" },
    password: { type: "string" },
  },
  required: ["username", "password"],
  additionalProperties: false,
};

export const signup = [
  validateBody(userSchema),
  asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const user = await User.create<UserInput>({
        username: req.body.username,
        password: req.body.password,
      });
      res.status(201).json({ msg: "Account created successfully." });
    }
  ),
];

export const login = [
  validateBody(userSchema),
  passport.authenticate("local"),
  (req: Request, res: Response, next: NextFunction) => {
    res.json({ msg: "Logged in successfully." });
  },
];

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).json({ msg: "Logged out successfully." });
  });
};
