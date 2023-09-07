import { ObjectId } from "../config/mongoose.config.js";
import Todo from "../models/todo.model.js";
import User, { USER_ROLE } from "../models/user.model.js";
import unescape from "validator/lib/unescape.js";

// will need to add preset steps later on
const createTodo = async (title, userCreator, assignedTo, categorie, dueOn, priority, detail) => {
  let newError = null;
  const newTodo = {
    title,
    created: {
      by: userCreator,
    },
    assignedTo,
    categorie,
    dueOn: unescape(dueOn),
    priority,
    detail,
  };

  try {
    const todo = await Todo.create(newTodo);
    const users = await User.find({ _id: assignedTo });
    for (let user of users) {
      user.todosAssigned.push(todo._id);
      await user.save();
    }
  } catch (e) {
    newError = `cannot create new to-do : ${e.message}`;
  } finally {
    return { newTodo, newError };
  }
};

const deleteTodo = async (userId, todoId) => {
  let error = null;
  let result = null;
  let user = null;

  try {
    user = await User.findById(userId);
    const todo = await Todo.findById(todoId);
    if (userId !== todo.created.by.toString() && user?.role !== USER_ROLE.SUPERVISOR) {
      throw new Error("You don't have the right to delete a to-do you didn't initiated");
    }
    const users = await User.find({ _id: todo.assignedTo });
    for (let user of users) {
      user.todosAssigned.pull(todoId);
      await user.save();
    }
    result = await Todo.deleteOne({ _id: todoId });
    console.log("test delete todo DAO", result);
  } catch (e) {
    error = `Cannot delete to-do : ${e.message}`;
  } finally {
    return { result, user, error };
  }
};

// will need to add steps and progress later on
const editTodo = async (userId, todoId, title, assignedTo, categorie, dueOn, priority, detail) => {
  let error = null;
  let result = null;
  let user = null;

  try {
    user = await User.findById(userId);
    const todo = await Todo.findById(todoId);
    if (!todo.assignedTo.includes(userId) && user?.role !== USER_ROLE.SUPERVISOR) {
      throw new Error("You don't have the right to edit a to-do not assigned to you");
    }

    const users = await User.find({ _id: todo.assignedTo }); //remove todo from user document if assignement list was changed
    for (let user of users) {
      if (!assignedTo.includes(user._id)) {
        user.todosAssigned.pull(todoId);
      }
      await user.save();
    }
    todo.title = title; // update todo then save it
    todo.assignedTo = assignedTo;
    todo.categorie = categorie;
    todo.dueIn = dueOn;
    todo.priority = priority;
    todo.detail = detail;
    await todo.save();

    const newUsers = await User.find({ _id: assignedTo }); // add todo to user's todo's assigned if added to assignedTo list
    for (let user of newUsers) {
      if (!todosAssigned.includes(todoId)) {
        user.todosAssigned.push(todo._id);
        await user.save();
      }
    }
    result = await Todo.findById(todoId);
  } catch (e) {
    error = `Cannot delete to-do : ${e.message}`;
  } finally {
    return { result, user, error };
  }
};

export const todoDAO = {
  createTodo,
  deleteTodo,
  editTodo,
};
