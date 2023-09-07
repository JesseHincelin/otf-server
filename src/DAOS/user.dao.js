import Categorie from "../models/categorie.model.js";
import Todo from "../models/todo.model.js";
import User from "../models/user.model.js";

const findUserById = async (userId) => {
  let user = null;
  let error = null;

  try {
    user = await User.findById(userId);
    if (!user) throw new Error(`User not found`);
  } catch (e) {
    error = `Cannot find user : ${e.message}`;
  } finally {
    return { error, user };
  }
};

const getUser = async (userId) => {
  let userError = null;
  let userPopulated = null;

  try {
    userPopulated = await User.findById(userId).populate({
      path: "todosAssigned",
      populate: { path: "categorie" },
    });
  } catch (e) {
    userError = `Cannot get user : ${e.message}`;
  } finally {
    return { userPopulated, userError };
  }
};

const readByUserName = async (userName) => {
  let user = null;
  let error = null;

  try {
    user = await User.findOne({ userName });
    if (!user) throw new Error(`User ${userName} not found`);
  } catch (e) {
    error = `Cannot find user : ${e.message}`;
  } finally {
    return { error, user };
  }
};

const changePass = async (userId, password, newPassword) => {
  let user = null;
  let error = null;

  try {
    user = await User.findById(userId);
    if (!user) throw new Error("user not found");
    if (user.password !== password) throw new Error("Wrong old password");
    user.password = newPassword;
    user.firstConnection = false;
    await user.save();
  } catch (e) {
    error = `Cannot change password : ${e.message}`;
  } finally {
    return { error, user };
  }
};

const newTheme = async (userId, theme) => {
  let user = null;
  let error = null;

  try {
    user = await User.findById(userId);
    if (!user) throw new Error("user not found");
    user.theme = theme;
    await user.save();
  } catch (e) {
    error = `Cannot change theme : ${e.message}`;
  } finally {
    return { error, user };
  }
};

const newCategorie = async (userId, name, color) => {
  let error = null;
  const categorie = {
    name,
    createdBy: userId,
    color,
  };

  try {
    await Categorie.create(categorie);
  } catch (e) {
    error = `Cannot create new categorie : ${e.message}`;
  } finally {
    return { error, categorie };
  }
};

const editCategorie = async (userId, categorieId, name, color) => {
  let error = null;
  let categorie = null;

  try {
    const categorie = await Categorie.findById(categorieId);
    if (!categorie.createdBy.toString() !== userId)
      throw new Error("You cannot edit a categorie you did not create");
    categorie.name = name;
    categorie.color = color;
    await categorie.save();
  } catch (e) {
    error = `Cannot edit this categorie : ${e.message}`;
  } finally {
    return { error, categorie };
  }
};

const deleteCategorie = async (userId, categorieId) => {
  let error = null;
  let result = null;

  try {
    const categorie = await Categorie.findById(categorieId);
    const todos = await Todo.find({ categorie: categorieId });
    if (todos.length > 0) throw new Error("You cannot delete a categorie with todos assigned");
    if (categorie.createdBy.toString() !== userId)
      throw new Error("you cannot delete a categorie that you did not create");
    result = await Categorie.deleteOne({ _id: categorieId });
    if (result.deletedCount !== 1) throw new Error("Something went wrong with the deletion");
  } catch (e) {
    error = `Cannot delete this categorie : ${e.message}`;
  } finally {
    return { error, result };
  }
};

export const userDAO = {
  findUserById,
  getUser,
  readByUserName,
  changePass,
  newTheme,
  newCategorie,
  editCategorie,
  deleteCategorie,
};
