import { Router } from "express";
import * as z from "../utils/zod.js";
import { login, signup } from "../controllers/auth.controller.js";
import { validateResource } from "../middlewares/zod.middleware.js";
import { sendErrorResponse } from "../utils/error.js";
import { handleMiddlewareError } from "../utils/async.js";

var router = Router();
export default router;

// ===========================
// Routes
// ===========================

router.post(
  "/signup",
  validateResource(z.signupSchema),
  handleMiddlewareError(signup),
  sendErrorResponse
);

router.post(
  "/login",
  validateResource(z.signupSchema),
  handleMiddlewareError(login),
  sendErrorResponse
);
