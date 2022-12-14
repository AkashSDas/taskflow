import { Router } from "express";
import * as z from "../utils/zod.js";
import {
  accesssTokenController,
  loginController,
  logoutController,
  signupController,
} from "../controllers/auth.controller.js";
import { validateResource } from "../middlewares/zod.middleware.js";
import { sendErrorResponse } from "../utils/error.js";
import { handleMiddlewareError } from "../utils/async.js";

var router = Router();
export default router;

// ===========================
// Routes
// ===========================

// Signup a new user, login and get access token
router.post(
  "/signup",
  validateResource(z.signupSchema),
  handleMiddlewareError(signupController),
  sendErrorResponse
);

// Login user and get access token
router.post(
  "/login",
  validateResource(z.signupSchema),
  handleMiddlewareError(loginController),
  sendErrorResponse
);

// Get new access token with user
router.get(
  "/access-token",
  handleMiddlewareError(accesssTokenController),
  sendErrorResponse
);

// Logout user
router.get(
  "/logout",
  handleMiddlewareError(logoutController),
  sendErrorResponse
);
