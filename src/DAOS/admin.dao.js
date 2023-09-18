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
    console.log("list of users :", list);
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
    user.domain = domain;
    user.groupe = groupe;
    user.role = role;
    await user.save();
  } catch (e) {
    error = `Cannot edit user : ${e.message}`;
  } finally {
    return { user, error };
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
};
