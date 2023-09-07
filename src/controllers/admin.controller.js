import { adminDAO } from "../DAOS/admin.dao.js";
import { userDAO } from "../DAOS/user.dao.js";
import { hashed } from "../utils/hash.utils.js";
import { jwtSign } from "../utils/jwt.utils.js";
import { passwordIsValid } from "../utils/regex.utils.js";
import { userInfos } from "../utils/user.utils.js";

const createAccount = async (req, res) => {
  const { userId, userName, password, domain, groupe, role } = req.body;

  const { admin, adminError } = await adminDAO.controlAdmin(userId);
  if (!!adminError || !admin) return res.status(401).json({ message: adminError });

  const { user, error } = await userDAO.readByUserName(userName);
  if (!!user) return res.status(400).json({ message: "This user name already exist" });

  const passwordIsOkay = passwordIsValid(password);
  if (!passwordIsOkay) return res.status(400).json({ message: "Password is not strong enough" });

  const { hashedPassword, err } = await hashed(password);
  if (!hashedPassword || !!err) return res.status(400).json({ message: err });

  const { newError, newUser } = await adminDAO.signUp(
    userName,
    hashedPassword,
    domain,
    groupe,
    role
  );
  if (!!newError) return res.status(400).json({ message: newError });

  res.status(201).json({ message: "User successfully created", user: userInfos(newUser) });
};

const createAdmin = async (req, res) => {
  const { userId, userName, password, domain, groupe, role } = req.body;

  const { admin, adminError } = await adminDAO.controlAdmin(userId);
  if (!!adminError || !admin) return res.status(401).json({ message: adminError });

  const { user, error } = await userDAO.readByUserName(userName);
  if (!!user) return res.status(400).json({ message: "This user name already exist" });

  const passwordIsOkay = passwordIsValid(password);
  if (!passwordIsOkay) return res.status(400).json({ message: "Password is not strong enough" });

  const { hashedPassword, err } = await hashed(password);
  if (!hashedPassword || !!err) return res.status(400).json({ message: err });

  console.log("hashed password in controller :", hashedPassword);

  const { newAdmin, newError } = await adminDAO.newAdmin(
    userName,
    hashedPassword,
    domain,
    groupe,
    role
  );
  if (!!newError || !newAdmin) return res.status(400).json({ message: newError });

  res.status(201).json({ message: "Admin successfully created", user: userInfos(newAdmin) });
};

const resetPassword = async (req, res) => {
  const { userId, userName, newPassword } = req.body;

  const { admin, adminError } = await adminDAO.controlAdmin(userId);
  if (!!adminError || !admin) return res.status(401).json({ message: adminError });

  const { hashedPassword, err } = await hashed(newPassword);
  if (!hashedPassword || !!err) return res.status(400).json({ message: err });

  const { user, error } = await adminDAO.resetPass(userName, hashedPassword);
  if (!user || !!error) return res.status(400).json({ message: error });

  res.status(201).json({ message: "Password reset successful", user: userInfos(user) });
};

const deleteAccount = async (req, res) => {
  const { userId } = req.body;
  const { idToDelete } = req.params;

  const { admin, adminError } = await adminDAO.controlAdmin(userId);
  if (!!adminError || !admin) return res.status(401).json({ message: adminError });

  const { deleteIsOkay, error } = await adminDAO.deleteAccount(idToDelete);
  if (!!error || !deleteIsOkay) return res.status(400).json({ message: error });

  res.status(201).json({ message: "Account deleted successfully" });
};

const getAllUsers = async (req, res) => {
  const { userId } = req.body;

  const { admin, adminError } = await adminDAO.controlAdmin(userId);
  if (!!adminError || !admin) return res.status(401).json({ message: adminError });

  const { users, error } = await adminDAO.seeAllUsers();
  if (!!error || !users) return res.status(400).json({ message: error });

  res.status(201).json({ message: "Here are all the accounts", users: users });
};

const editUser = async (req, res) => {
  const { userId, userName, domain, groupe, role } = req.body;

  const { admin, adminError } = await adminDAO.controlAdmin(userId);
  if (!!adminError || !admin) return res.status(401).json({ message: adminError });

  const { user, error } = await adminDAO.editUser(userName, domain, groupe, role);
  if (!!error || !user) return res.status(400).json({ message: error });

  res.status(202).json({ message: "User edited successfully", user: userInfos(user) });
};

export const adminController = {
  createAccount,
  createAdmin,
  resetPassword,
  deleteAccount,
  getAllUsers,
  editUser,
};
