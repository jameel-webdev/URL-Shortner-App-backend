import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getAllUsers,
} from "../controllers/userControllers.js";

const router = express.Router();

// REGISTRATION
router.route("/register").post(registerUser);
// LOGIN
router.route("/login").post(loginUser);
// LOGOUT
router.route("/logout").post(logoutUser);
// FORGOT-PASSWORD
router.route("/forgotpassword").post(forgotPassword);
// RESET-PASSWORD
router.route("/resetpassword").put(resetPassword);
// GET ALL USERS
router.route("/getallusers").get(getAllUsers);

export default router;
