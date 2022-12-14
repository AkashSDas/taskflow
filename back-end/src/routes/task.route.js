import { Router } from "express";
import { createTaskController } from "../controllers/task.controller.js";
import { validateResource } from "../middlewares/zod.middleware.js";
import * as z from "../utils/zod.js";
import { handleMiddlewareError } from "../utils/async.js";
import { sendErrorResponse } from "../utils/error.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

var router = Router();
export default router;

// ===========================
// Routes
// ===========================

// Create a new task
router.post(
  "",
  validateResource(z.createTaskSchema),
  handleMiddlewareError(verifyJwt),
  handleMiddlewareError(createTaskController),
  sendErrorResponse
);
