import { adminDAO } from "../DAOS/admin.dao.js";
import { userDAO } from "../DAOS/user.dao.js";
import { USER_ROLE } from "../models/user.model.js";
import { compareHash, hashed } from "../utils/hash.utils.js";
import { jwtSign } from "../utils/jwt.utils.js";
import { passwordIsValid } from "../utils/regex.utils.js";
import { userInfos } from "../utils/user.utils.js";

const login = async (req, res) => {
  const { password, userName, domain } = req.body;
  const messageError = `Fail to login. User name or password incorrect.`;

  const { error, user } = await userDAO.readByUserName(userName);
  if (!!error) return res.status(400).json({ message: messageError });

  const { match, err } = await compareHash(password, user.password);
  if (!match || !!err) return res.status(400).json({ message: messageError });

  const token = jwtSign(user.id);

  let groupes = null;
  let groupesError = null;
  if (user.role === USER_ROLE.ADMIN || user.role === USER_ROLE.SUPER_ADMIN) {
    const result = await adminDAO.getAllGroupes();
    groupes = result.groupes;
    groupesError = result.groupesError;
    if (!!groupesError) return res.status(400).json({ message: groupesError });
  }

  let groupeMembers = null;
  let groupeErr = null;
  if (user.role === USER_ROLE.SUPERVISOR) {
    const resultGroup = await userDAO.getGroup(user.groupe);
    groupeMembers = resultGroup.groupe;
    groupeErr = resultGroup.groupeErr;
    if (groupeMembers.length < 1 || !!groupeErr)
      return res.status(400).json({ message: groupeErr });
  }

  const { userPopulated, userError } = await userDAO.getUser(user.id);
  if (!!userError || !userPopulated) return res.status(400).json({ message: userError });

  const { categories, categoriesError } = await userDAO.getCategories(userPopulated);
  if (!!categoriesError || !categories) return res.status(400).json({ message: categoriesError });

  res.status(200).json({
    message: `Login succesfully !`,
    user: userInfos(userPopulated),
    token,
    groupes,
    groupeMembers,
    categories,
  });
};

const autoConnect = async (req, res) => {
  const { userId } = req.body;

  const { userError, userPopulated } = await userDAO.getUser(userId);
  if (!!userError || !userPopulated) return res.status(400).json({ message: userError });

  let groupes = null;
  let groupesError = null;
  if (userPopulated.role === USER_ROLE.ADMIN || userPopulated.role === USER_ROLE.SUPER_ADMIN) {
    const result = await adminDAO.getAllGroupes();
    groupes = result.groupes;
    groupesError = result.groupesError;
    if (groupes.length < 1 || !!groupesError)
      return res.status(400).json({ message: groupesError });
  }

  let groupeMembers = null;
  let groupeErr = null;
  if (userPopulated.role === USER_ROLE.SUPERVISOR) {
    const resultGroup = await userDAO.getGroup(userPopulated.groupe);
    groupeMembers = resultGroup.groupe;
    groupeErr = resultGroup.groupeErr;
    if (groupeMembers.length < 1 || !!groupeErr)
      return res.status(400).json({ message: groupeErr });
  }

  const { categories, categoriesError } = await userDAO.getCategories(userPopulated);
  if (!!categoriesError || !categories) return res.status(400).json({ message: categoriesError });

  return res.status(200).json({
    message: "Reconnection successful",
    user: userInfos(userPopulated),
    groupes,
    groupeMembers,
    categories,
  });
};

const changePassword = async (req, res) => {
  const { userId, password, newPassword } = req.body;

  const passwordIsOkay = passwordIsValid(newPassword);
  if (!passwordIsOkay)
    return res.status(400).json({ message: "New password is not strong enough" });

  const controle = await userDAO.findUserById(userId);
  if (!!controle.error) return res.status(400).json({ message: controle.error });

  const { match, err } = await compareHash(password, controle.user.password);
  if (!match || !!err) return res.status(400).json({ message: err });

  const newPass = await hashed(newPassword);
  if (!newPass.hashedPassword || !!newPass.err)
    return res.status(400).json({ message: newPass.err });

  // const oldPass = await hashed(password);
  // if (!oldPass.hashedPassword || !!oldPass.err)
  //   return res.status(400).json({ message: oldPass.err });

  const { user, error } = await userDAO.changePass(userId, newPass.hashedPassword);
  if (!user || !!error) return res.status(400).json({ message: error });

  const { userPopulated, userError } = await userDAO.getUser(user.id);
  if (!!userError || !userPopulated) return res.status(400).json({ message: userError });

  res.json({ message: `Password changed succesfully !`, user: userInfos(userPopulated) });
};

const changeTheme = async (req, res) => {
  const { userId, theme } = req.body;

  const { user, error } = await userDAO.newTheme(userId, theme);
  if (!user || !!error) return res.status(400).json({ message: error });

  const { userPopulated, userError } = await userDAO.getUser(user.id);
  if (!!userError || !userPopulated) return res.status(400).json({ message: userError });

  res.json({ message: `Theme changed succesfully !`, user: userInfos(userPopulated) });
};

const createCategorie = async (req, res) => {
  const { userId, name, color } = req.body;

  const { error, categorie } = await userDAO.newCategorie(userId, name, color);
  if (!!error || !categorie) return res.status(400).json({ message: error });

  const { userPopulated, userError } = await userDAO.getUser(userId);
  if (!!userError || !userPopulated) return res.status(400).json({ message: userError });

  const { categories, categoriesError } = await userDAO.getCategories(userPopulated);
  if (!!categoriesError || !categories) return res.status(400).json({ message: categoriesError });

  return res.status(200).json({
    message: "Categorie successfully created",
    // user: userInfos(userPopulated),
    categories,
  });
};

const editCategorie = async (req, res) => {
  const { userId, categorieId, name, color } = req.body;

  const { error, categorie } = await userDAO.editCategorie(userId, categorieId, name, color);
  if (!!error || !categorie) return res.status(400).json({ message: error });

  const { userPopulated, userError } = await userDAO.getUser(user.id);
  if (!!userError || !userPopulated) return res.status(400).json({ message: userError });

  const { categories, categoriesError } = await userDAO.getCategories(userPopulated);
  if (!!categoriesError || !categories) return res.status(400).json({ message: categoriesError });

  return res
    .status(200)
    .json({ message: "Categorie successfully edited", user: userInfos(userPopulated), categories });
};

const deleteCategorie = async (req, res) => {
  const { userId } = req.body;
  const { categorieId } = req.params;

  const { result, error } = await userDAO.deleteCategorie(userId, categorieId);
  if (!!error || !result) return res.status(400).json({ message: error });

  const { userPopulated, userError } = await userDAO.getUser(user.id);
  if (!!userError || !userPopulated) return res.status(400).json({ message: userError });

  const { categories, categoriesError } = await userDAO.getCategories(userPopulated);
  if (!!categoriesError || !categories) return res.status(400).json({ message: categoriesError });

  return res.status(200).json({
    message: "Categorie successfully deleted",
    user: userInfos(userPopulated),
    categories,
  });
};

export const userController = {
  login,
  autoConnect,
  changePassword,
  changeTheme,
  createCategorie,
  editCategorie,
  deleteCategorie,
};
