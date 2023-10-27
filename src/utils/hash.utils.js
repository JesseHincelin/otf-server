import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hashed = async (password) => {
  let hashedPassword = null;
  let error = null;

  try {
    hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  } catch (e) {
    error = `Error when hash ${e.message}`;
  } finally {
    return { hashedPassword, err: error };
  }
};

export const compareHash = async (password, userPassword) => {
  let error = null;
  let match = false;

  try {
    match = await bcrypt.compare(password, userPassword);
  } catch (e) {
    error = `Error when compare : ${e.message}`;
  } finally {
    return { match, err: error };
  }
};
