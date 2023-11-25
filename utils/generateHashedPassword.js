import bcrypt from "bcryptjs";
import crypto from "crypto";

export const generateHashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};
export const validatingPassword = async (password, userPassword) => {
  const validation = await bcrypt.compare(password, userPassword);
  if (validation) {
    return true;
  } else {
    return false;
  }
};
