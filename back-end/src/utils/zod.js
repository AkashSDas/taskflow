import { z } from "zod";
import { Priority, Status } from "../models/task.schema.js";

// =============================
// Auth
// =============================

export var signupSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Required" })
      .email({ message: "Invalid" }),
    password: z
      .string({ required_error: "Required" })
      .min(8, "Too short")
      .max(64, "Too long")
      .refine((pwd) => /[a-z]{3}/.test(pwd), "Must contain 3 lowercase letters")
      .refine((pwd) => /[A-Z]{2}/.test(pwd), "Must contain 2 uppercase letters")
      .refine((pwd) => /[0-9]{2}/.test(pwd), "Must contain 2 numbers")
      .refine(
        (pwd) => /[!@#$%^&*()\-__+.]{1}/.test(pwd),
        "Must contain 1 special character"
      ),
  }),
});

// =============================
// Task
// =============================

export var createTaskSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Required" }).min(3, "Too short"),
    priority: z.enum(Object.values(Priority)).optional(),
  }),
});

export var addTodoSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Required" }).min(3, "Too short"),
  }),
});

export var updateTodoStatusSchema = z.object({
  body: z.object({
    done: z.boolean({ required_error: "Required" }),
  }),
});

export var updateTaskStatusSchema = z.object({
  body: z.object({
    status: z.enum(Object.values(Status), { required_error: "Required" }),
  }),
});

export var searchTasksSchema = z.object({
  query: z.object({
    query: z
      .string({ required_error: "Required" })
      .min(3, "Too short")
      .max(64, "Too long"),
  }),
});
