import { JSONSchemaType } from "ajv";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import validateBody from "../middleware/validateBody.js";
import User, { UserInput } from "../models/user.js";

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

export const login = [
  validateBody(userSchema),
  passport.authenticate("local"),
  (req: Request, res: Response, next: NextFunction) => {
    res.json({ msg: "Logged in successfully." });
  },
];

