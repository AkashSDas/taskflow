import { Router } from "express";
import {
  addTodoController,
  createTaskController,
  deleteTaskController,
  getAllTasksController,
  getTaskController,
  removeTodoController,
  updateTaskStatusController,
  updateTodoStatusController,
} from "../controllers/task.controller.js";
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

// Add todo
router.put(
  "/:taskId/todo",
  validateResource(z.addTodoSchema),
  handleMiddlewareError(verifyJwt),
  handleMiddlewareError(addTodoController),
  sendErrorResponse
);

// Update todo status
router.put(
  "/:taskId/todo/:todoId",
  validateResource(z.updateTodoStatusSchema),
  handleMiddlewareError(verifyJwt),
  handleMiddlewareError(updateTodoStatusController),
  sendErrorResponse
);

// Delete todo
router.delete(
  "/:taskId/todo/:todoId",
  handleMiddlewareError(verifyJwt),
  handleMiddlewareError(removeTodoController),
  sendErrorResponse
);

// Get all tasks
router.get(
  "",
  handleMiddlewareError(verifyJwt),
  handleMiddlewareError(getAllTasksController),
  sendErrorResponse
);

// Delete a task
router.delete(
  "/:taskId",
  handleMiddlewareError(verifyJwt),
  handleMiddlewareError(deleteTaskController),
  sendErrorResponse
);

router.get(
  "/:taskId",
  handleMiddlewareError(verifyJwt),
  handleMiddlewareError(getTaskController),
  sendErrorResponse
);

router.put(
  "/:taskId/status",
  validateResource(z.updateTaskStatusSchema),
  handleMiddlewareError(verifyJwt),
  handleMiddlewareError(updateTaskStatusController),
  sendErrorResponse
);
