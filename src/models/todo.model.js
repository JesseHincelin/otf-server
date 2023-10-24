import { createCollection, ObjectId, Schema } from "../config/mongoose.config.js";
import { currentDate } from "../utils/date.utils.js";
import { dateIsValid } from "../utils/regex.utils.js";

const TODO_PRIORITY = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};
const TODO_COMPLETED = {
  COMPLETED: true,
  NOT_COMPLETED: false,
};

const todoSchema = new Schema({
  title: String,
  created: {
    by: { type: ObjectId, ref: "User" },
    on: {
      type: String,
      default: currentDate(),
      required: [true, "Creation date required"],
      validate: {
        validator: (date) => {
          const isOk = dateIsValid(date);
          return isOk;
        },
        message: "Date is not valid !",
      },
    },
  },
  assignedTo: [{ type: ObjectId, ref: "User" }],
  categorie: { type: ObjectId, ref: "Categorie" },
  dueOn: {
    type: String,
    required: [true, "Due date required"],
    validate: {
      validator: (date) => {
        const isOk = dateIsValid(date);
        return isOk;
      },
      message: "Date is not valid !",
    },
  },
  priority: {
    type: String,
    default: TODO_PRIORITY.LOW,
    enum: { values: [TODO_PRIORITY.LOW, TODO_PRIORITY.MEDIUM, TODO_PRIORITY.HIGH] },
  },
  detail: String,
  steps: [{ type: String }],
  progress: [
    {
      info: String,
      by: String,
      on: {
        type: String,
        // required: [true, "Edition date required"],
        validate: {
          validator: (date) => {
            const isOk = dateIsValid(date);
            return isOk;
          },
          message: "Date is not valid !",
        },
      },
    },
  ],
  completed: {
    type: Boolean,
    default: TODO_COMPLETED.NOT_COMPLETED,
    enum: { values: [TODO_COMPLETED.COMPLETED, TODO_COMPLETED.NOT_COMPLETED] },
  },
});

const Todo = createCollection("Todo", todoSchema);

export default Todo;
