import { Router } from "express";
import { signup } from "../controllers/auth.controller.js";

var router = Router();
export default router;

// ===========================
// Routes
// ===========================

router.post("/signup", signup);
