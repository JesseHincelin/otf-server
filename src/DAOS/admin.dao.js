import Groupe from "../models/groupe.model.js";
import User, { USER_ROLE } from "../models/user.model.js";

const signUp = async (userName, password, domain, groupe, role) => {
  let newError = null;
  const newUser = {
    userName,
    password,
    domain,
    groupe,
    role,
  };
  try {
    if (role === USER_ROLE.ADMIN || role === USER_ROLE.SUPER_ADMIN)
      throw new Error("You don't have the rights to create a user with this role");
    // const newUser =
    const userGroupe = await Groupe.findById(groupe);
    if (!userGroupe) throw new Error("This groupe does not exist");
    newUser.groupe = userGroupe;
    await User.create(newUser);
    // await newUser.save();
  } catch (e) {
    error = `Cannot create user : ${e.message}`;
  } finally {
    return { newError, newUser };
  }
};

const newAdmin = async (userName, password, domain, groupe, role) => {
  let newError = null;
  const newAdmin = {
    userName,
    password,
    domain,
    groupe,
    role,
  };

  try {
    await User.create(newAdmin);
  } catch (e) {
    newError = `Cannot create new admin : ${e.message}`;
  } finally {
    return { newAdmin, newError };
  }
};

const controlAdmin = async (userId) => {
  let adminError = null;
  let admin = null;

  try {
    admin = await User.findById(userId);
    if (admin.role !== USER_ROLE.ADMIN && admin.role !== USER_ROLE.SUPER_ADMIN)
      throw new Error("You are not an admin");
  } catch (e) {
    adminError = `Unauthorized action : ${e.message}`;
  } finally {
    return { admin, adminError };
  }
};

const resetPass = async (userName, password) => {
  let user = null;
  let error = null;

  try {
    user = await User.findOne({ userName: userName });
    if (!user) throw new Error("User does not exist");
    user.password = password;
    user.firstConnection = true;
    await user.save();
  } catch (e) {
    error = `Password reset failed : ${e.message}`;
  } finally {
    return { user, error };
  }
};

const deleteAccount = async (idToDelete) => {
  let deleteIsOkay = false;
  let error = null;

  try {
    const user = await User.findById(idToDelete);
    if (!user) throw new Error("This account does not exist");
    if (user.role === USER_ROLE.ADMIN || user.role === USER_ROLE.SUPER_ADMIN)
      // add condition for super admin to delete admin
      throw new Error("You don't have the rights to delete this account");
    const { deletedCount } = await User.deleteOne({ _id: idToDelete });
    if (!deletedCount) throw new Error("Could not delete account");
    if (deletedCount > 1) throw new Error("More than one account have been deleted");
    deleteIsOkay = true;
  } catch (e) {
    error = `Account suppression failed : ${e.message}`;
  } finally {
    return { deleteIsOkay, error };
  }
};

const seeAllUsers = async () => {
  const users = [];
  let error = null;

  try {
    const list = await User.find({});
    for (let i = 0; i < list.length; i++) {
      const user = list[i];
      if (user.role !== USER_ROLE.SUPER_ADMIN) {
        const userInfo = {
          userName: user.userName,
          role: user.role,
          domain: user.domain,
          groupe: user.groupe,
        };
        users.push(userInfo);
      }
    }
  } catch (e) {
    error = `Cannot find the users : ${e.message}`;
  } finally {
    return { users, error };
  }
};

const editUser = async (userName, domain, groupe, role) => {
  let error = null;
  let user = null;

  try {
    user = await User.findOne({ userName: userName });
    if (user?.role === USER_ROLE.ADMIN || user?.role === USER_ROLE.SUPER_ADMIN)
      throw new Error("You don't have the right to edit an admin account");
    user.domain = domain;
    user.groupe = await Groupe.findById(groupe);
    user.role = role;
    await user.save();
  } catch (e) {
    error = `Cannot edit user : ${e.message}`;
  } finally {
    return { user, error };
  }
};

const createGroupe = async (title) => {
  let error = null;
  const groupe = {
    title: title,
  };

  try {
    const alreadyExist = await Groupe.findOne({ title: title });
    if (!!alreadyExist) throw new Error("This groupe already exist");
    await Groupe.create(groupe);
  } catch (e) {
    error = `Cannot create groupe : ${e.message}`;
  } finally {
    return { error, groupe };
  }
};

const editGroupe = async (groupeId, newTitle) => {
  let error = null;
  let groupe = null;

  try {
    const alreadyExist = await Groupe.findOne({ title: newTitle });
    console.log("Check if groupe title exist for edit :", alreadyExist);
    if (!!alreadyExist) throw new Error("This groupe already exist");
    groupe = await Groupe.findById(groupeId);
    console.log("check if groupe is found :", groupe);
    if (!groupe) throw new Error("Groupe does not exist");
    groupe.title = newTitle;
    await groupe.save();
  } catch (e) {
    error = `Cannot edit groupe : ${e.message}`;
  } finally {
    return { error, groupe };
  }
};

const deleteGroupe = async (groupeId) => {
  let error = null;
  let deleteIsOkay = false;

  try {
    const { deletedCount } = await Groupe.deleteOne({ _id: groupeId });
    if (!deletedCount) throw new Error("Could not delete groupe");
    if (deletedCount > 1) throw new Error("More than one groupe have been deleted");
    deleteIsOkay = true;
  } catch (e) {
    error = `Cannot delete groupe : ${e.message}`;
  } finally {
    return { error, deleteIsOkay };
  }
};

const getAllGroupes = async () => {
  let groupeError = null;
  const groupes = [];

  try {
    const list = await Groupe.find({});
    for (let i = 0; i < list.length; i++) {
      groupes.push(list[i]);
    }
  } catch (e) {
    groupeError = `Cannot create groupe : ${e.message}`;
  } finally {
    return { groupeError, groupes };
  }
};

export const adminDAO = {
  signUp,
  newAdmin,
  controlAdmin,
  resetPass,
  deleteAccount,
  seeAllUsers,
  editUser,
  createGroupe,
  editGroupe,
  deleteGroupe,
  getAllGroupes,
};
