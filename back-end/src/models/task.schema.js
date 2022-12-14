import { model, Schema } from "mongoose";

export var Priority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

export var Status = {
  NOT_STARTED: "not started",
  IN_PROGRESS: "in progress",
  DONE: "done",
};

var taskSchema = new Schema(
  {
    title: { type: String, required: true, min: 3, max: 256, trim: true },
    priority: { type: String, enum: Object.values(Priority) },
    deadline: { type: Date },
    status: {
      type: String,
      required: true,
      enum: Object.values(Status),
      default: Status.NOT_STARTED,
    },
    assigns: {
      type: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
      default: [],
      required: true,
    },
    todos: {
      type: [
        {
          title: { type: String, required: true, min: 3, max: 256, trim: true },
          done: { type: Boolean, required: true, default: false },
        },
      ],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

var Task = model("Task", taskSchema);
export default Task;
