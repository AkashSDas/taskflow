import { Types } from "mongoose";
import Task from "../models/task.schema.js";

/**
 * Create a new task
 * @route POST /api/v1/task
 * @remark priority is optional
 */
export async function createTaskController(req, res) {
  var user = res.locals.user;
  var { title, priority } = req.body;
  var task = await Task.create({
    title,
    assigns: [user._id],
    priority: priority,
  });

  return res.status(201).json({ task });
}

/**
 * Add todo in the task
 * @route PUT /api/v1/task/:taskId/todo
 */
export async function addTodoController(req, res) {
  var user = res.locals.user;
  var taskId = req.params.taskId;

  var task = await Task.findOneAndUpdate(
    { $and: [{ _id: taskId }, { assigns: { $in: user._id } }] },
    { $push: { todos: { title: req.body.title } } },
    { new: true }
  );

  if (!task) return res.status(404).json({ message: "Task not found" });
  return res.status(200).json({ task });
}

/**
 * Update todo status
 * @route PUT /api/v1/task/:taskId/todo/:todoId
 */
export async function updateTodoStatusController(req, res) {
  var user = res.locals.user;
  var { taskId, todoId } = req.params;

  var task = await Task.findOneAndUpdate(
    {
      $and: [
        { _id: taskId },
        { "todos._id": todoId },
        { assigns: { $in: user._id } },
      ],
    },
    { $set: { "todos.$[t].done": req.body.done } },
    { new: true, arrayFilters: [{ "t._id": new Types.ObjectId(todoId) }] }
  );

  if (!task) return res.status(404).json({ message: "Task not found" });
  return res.status(200).json({ task });
}

export async function removeTodoController(req, res) {
  var user = res.locals.user;
  var { taskId, todoId } = req.params;

  var task = await Task.findOneAndDelete({
    $and: [
      { _id: taskId },
      { "todos._id": todoId },
      { assigns: { $in: user._id } },
    ],
  });

  if (!task) return res.status(404).json({ message: "Task not found" });
  return res.status(200).json({ task });
}

export async function getAllTasksController(req, res) {
  var user = res.locals.user;
  var tasks = await Task.find({ assigns: { $in: user._id } });
  return res.status(200).json({ tasks });
}

export async function deleteTaskController(req, res) {
  var user = res.locals.user;
  var taskId = req.params.taskId;

  var task = await Task.findOneAndDelete({
    $and: [{ _id: taskId }, { assigns: { $in: user._id } }],
  });

  if (!task) return res.status(404).json({ message: "Task not found" });
  return res.status(200).json({ task });
}

export async function getTaskController(req, res) {
  var user = res.locals.user;
  var taskId = req.params.taskId;

  var task = await Task.findOne({
    $and: [{ _id: taskId }, { assigns: { $in: user._id } }],
  }).populate("assigns");

  if (!task) return res.status(404).json({ message: "Task not found" });
  return res.status(200).json({ task });
}

export async function updateTaskStatusController(req, res) {
  var user = res.locals.user;
  var taskId = req.params.taskId;

  var task = await Task.findOneAndUpdate(
    { $and: [{ _id: taskId }, { assigns: { $in: user._id } }] },
    { $set: { status: req.body.status } },
    { new: true }
  );

  if (!task) return res.status(404).json({ message: "Task not found" });
  return res.status(200).json({ task });
}

export async function searchTasksController(req, res) {
  var user = res.locals.user;
  var { title } = req.query;

  var tasks = await Task.find({
    $and: [{ title: { $regex: title, $options: "i" } }, { assigns: user._id }],
  });

  return res.status(200).json({ tasks });
}
