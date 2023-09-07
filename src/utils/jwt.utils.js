import jwt from "jsonwebtoken";
import { stringIsFilled } from "./string.utils.js";

// export const secret = "plop"; // the secret must be secure enough. If possible 16 char, upper and lowercase, special char, etc ...
export const secret = process.env.JWT_SECRET;

const jwtOptions = {
  expiresIn: `28800000`, // 8h
};

export const jwtVerifiy = (token) => {
  try {
    if (!secret) throw new Error("Secret must be defined !");
    const decoded = jwt.verify(token, secret);
    const userId = decoded.data;
    return stringIsFilled(userId) ? userId : null;
  } catch (err) {
    console.error("jwtVerify: error => ", err.message);
    return null;
  }
};

export const jwtSign = (data) => jwt.sign({ data: data }, secret, jwtOptions);
