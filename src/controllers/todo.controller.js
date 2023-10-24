import { todoDAO } from "../DAOS/todo.dao.js";
import { userDAO } from "../DAOS/user.dao.js";
import { USER_ROLE } from "../models/user.model.js";
import { userInfos } from "../utils/user.utils.js";

const newTodo = async (req, res) => {
  const { userId, title, assignedTo, categorie, dueOn, priority, detail } = req.body;

  const { user, error } = await userDAO.findUserById(userId);
  if (!!error || !user) return res.status(400).json({ message: error });
  if (user.role !== USER_ROLE.SUPERVISOR && !assignedTo.includes(user.id) && assignedTo.length > 1)
    return res.status(400).json({ message: "User cannot assigne to-do to other user" });

  const { newTodo, newError } = await todoDAO.createTodo(
    title,
    user.id,
    assignedTo,
    categorie,
    dueOn,
    priority,
    detail
  );
  if (!!newError || !newTodo) return res.status(400).json({ message: newError });

  const { userError, userPopulated } = await userDAO.getUser(userId);
  if (!!userError || !userPopulated) return res.status(400).json({ message: userError });

  return res
    .status(201)
    .json({ message: "New todo created and assigned", user: userInfos(userPopulated), newTodo });
};

const deleteTodo = async (req, res) => {
  const { userId } = req.body;
  const { todoId } = req.params;

  const { result, error, user } = await todoDAO.deleteTodo(userId, todoId);
  if (!!error || !result || !user) return res.status(400).json({ message: error });

  return res.status(200).json({ message: "todo successfully deleted", user: userInfos(user) });
};

const editTodo = async (req, res) => {
  const { userId, todoId, title, assignedTo, categorie, dueOn, priority, detail } = req.body;

  const { result, error, user } = await todoDAO.editTodo(
    userId,
    todoId,
    title,
    assignedTo,
    categorie,
    dueOn,
    priority,
    detail
  );
  if (!!error || !user || !result) return res.status(400).json({ message: error });

  return res
    .status(200)
    .json({ message: "todo successfully edited", user: userInfos(user), todo: result });
};

export const todoController = {
  newTodo,
  deleteTodo,
  editTodo,
};
