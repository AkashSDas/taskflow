import { model, Schema } from "mongoose";

var Priority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

var Status = {
  NOT_STARTED: "not started",
  IN_PROGRESS: "in progress",
  DONE: "done",
};

var todoSchema = new Schema({
  title: { type: String, required: true, min: 3, max: 256, trim: true },
  done: { type: Boolean, required: true, default: false },
});

var taskSchema = new Schema(
  {
    title: { type: String, required: true, min: 3, max: 256, trim: true },
    priority: { type: String, required: true, enum: Object.values(Priority) },
    deadline: { type: Date },
    status: { type: String, required: true, enum: Object.values(Status) },
    assigns: {
      type: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
      default: [],
      required: true,
    },
    todos: { type: [todoSchema], required: true, default: [] },
  },
  { timestamps: true }
);

var Task = model("Task", taskSchema);
export default Task;
