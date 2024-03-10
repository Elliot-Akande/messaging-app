import express from "express";
import { login, logout, signup } from "../controllers/auth.js";

const router = express.Router();

// POST login request.
router.post("/login", login);

// POST signup request.
router.post("/signup", signup);

// POST logout request.
router.post("/logout", logout);

export default router;
