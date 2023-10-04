import { createCollection, ObjectId, Schema } from "../config/mongoose.config.js";
import { REGEX, regexIsOk } from "../utils/regex.utils.js";

export const USER_ROLE = {
  SUPER_ADMIN: "super admin",
  ADMIN: "admin",
  SUPERVISOR: "supervisor",
  STAFF: "staff",
};

export const USER_THEME = {
  LIGHT: "light",
  DARK: "dark",
};

const userSchema = new Schema({
  userName: String,
  password: String,
  firstConnection: {
    type: Boolean,
    default: true,
    enum: [true, false],
  },
  role: {
    type: String,
    default: USER_ROLE.STAFF,
    enum: {
      values: [USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.SUPERVISOR, USER_ROLE.STAFF],
    },
  },
  domain: {
    type: String,
    required: [true, "Domain required"],
  },
  groupe: { type: ObjectId, ref: "Groupe" },
  theme: {
    type: String,
    default: USER_THEME.LIGHT,
    enum: {
      values: [USER_THEME.LIGHT, USER_THEME.DARK],
    },
  },
  todosAssigned: [{ type: ObjectId, ref: "Todo" }],
});

const User = createCollection("User", userSchema);

export default User;
