import express from "express";
import { login, signup } from "../controllers/auth.js";

const router = express.Router();

// POST login request.
router.post("/login", login);

// POST signup request.
router.post("/signup", signup);

export default router;
