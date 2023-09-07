import { userDAO } from "../DAOS/user.dao.js";
import { compareHash } from "../utils/hash.utils.js";
import { jwtSign } from "../utils/jwt.utils.js";
import { passwordIsValid } from "../utils/regex.utils.js";
import { userInfos } from "../utils/user.utils.js";

const login = async (req, res) => {
  const { password, userName } = req.body;
  const messageError = `Fail to login. User name or password incorrect.`;

  const { error, user } = await userDAO.readByUserName(userName);
  if (!!error) return res.status(400).json({ message: messageError });

  const { match, err } = await compareHash(password, user.password);
  if (!match || !!err) return res.status(400).json({ message: messageError });

  const token = jwtSign(user.id);

  const { userPopulated, userError } = await userDAO.getUser(user.id);
  if (!!userError || !userPopulated) return res.status(400).json({ message: userError });

  res.json({ message: `Login succesfully !`, user: userInfos(userPopulated), token });
};

const changePassword = async (req, res) => {
  const { userId, password, newPassword } = req.body;

  const passwordIsOkay = passwordIsValid(newPassword);
  if (!passwordIsOkay)
    return res.status(400).json({ message: "New password is not strong enough" });

  const newPass = await hashed(newPassword);
  if (!newPass.hashedPassword || !!newPass.err)
    return res.status(400).json({ message: newPass.err });

  const oldPass = await hashed(password);
  if (!oldPass.hashedPassword || !!oldPass.err)
    return res.status(400).json({ message: oldPass.err });

  const { user, error } = await userDAO.changePass(
    userId,
    oldPass.hashedPassword,
    newPass.hashedPassword
  );
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

  const { userPopulated, userError } = await userDAO.getUser(user.id);
  if (!!userError || !userPopulated) return res.status(400).json({ message: userError });

  return res
    .status(200)
    .json({ message: "Categorie successfully created", user: userInfos(userPopulated) });
};

const editCategorie = async (req, res) => {
  const { userId, categorieId, name, color } = req.body;

  const { error, categorie } = await userDAO.editCategorie(userId, categorieId, name, color);
  if (!!error || !categorie) return res.status(400).json({ message: error });

  const { userPopulated, userError } = await userDAO.getUser(user.id);
  if (!!userError || !userPopulated) return res.status(400).json({ message: userError });

  return res
    .status(200)
    .json({ message: "Categorie successfully edited", user: userInfos(userPopulated) });
};

const deleteCategorie = async (req, res) => {
  const { userId } = req.body;
  const { categorieId } = req.params;

  const { result, error } = await userDAO.deleteCategorie(userId, categorieId);
  if (!!error || !result) return res.status(400).json({ message: error });

  const { userPopulated, userError } = await userDAO.getUser(user.id);
  if (!!userError || !userPopulated) return res.status(400).json({ message: userError });

  return res
    .status(200)
    .json({ message: "Categorie successfully deleted", user: userInfos(userPopulated) });
};

export const userController = {
  login,
  changePassword,
  changeTheme,
  createCategorie,
  editCategorie,
  deleteCategorie,
};