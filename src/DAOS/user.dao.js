import Categorie from "../models/categorie.model.js";
import Todo from "../models/todo.model.js";
import User from "../models/user.model.js";
import { userInfos } from "../utils/user.utils.js";

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

const readByUserName = async (name) => {
  let user = null;
  let error = null;

  try {
    user = await User.findOne({ userName: name });
    if (!user) throw new Error(`User ${name} not found`);
  } catch (e) {
    error = `Cannot find user : ${e.message}`;
  } finally {
    return { error, user };
  }
};

const changePass = async (userId, newPassword) => {
  let user = null;
  let error = null;

  try {
    user = await User.findById(userId);
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

const getCategories = async (userPopulated) => {
  const categories = [];
  let categoriesError = null;

  try {
    for (let i = 0; i < userPopulated.todosAssigned.length; i++) {
      const categorie = userPopulated.todosAssigned[i].categorie;
      if (!categories.includes(categorie)) {
        categories.push(categorie);
      }
    }
    const savedCategories = await Categorie.find({ createdBy: userPopulated.id });
    for (let j = 0; j < savedCategories.length; j++) {
      if (!categories.includes(savedCategories[j])) {
        categories.push(savedCategories[j]);
      }
    }
    if (categories.length < 1) {
      const defaultCategorie = await Categorie.findById("65338a856d2300c7d4e33fba");
      categories.push(defaultCategorie);
    }
  } catch (e) {
    categoriesError = `Cannot get the categories : ${e.message}`;
  } finally {
    return { categories, categoriesError };
  }
};

const getGroup = async (groupeId) => {
  const groupe = [];
  let groupeErr = null;

  try {
    const users = await User.find({ groupe: groupeId });
    for (let i = 0; i < users.length; i++) {
      const user = userInfos(users[i]);
      groupe.push(user);
    }
  } catch (e) {
    groupeErr = `Cannot get the group information : ${e.message}`;
  } finally {
    return { groupe, groupeErr };
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
  getCategories,
  getGroup,
};
