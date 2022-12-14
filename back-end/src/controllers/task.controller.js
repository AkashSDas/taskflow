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
