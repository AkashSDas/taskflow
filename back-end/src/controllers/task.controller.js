import Task from "../models/tasks.schema.js";

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
