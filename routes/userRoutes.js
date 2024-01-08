import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getAllUsers,
  activation,
} from "../controllers/userControllers.js";

const router = express.Router();

// REGISTRATION
router.route("/register").post(registerUser);
// ACCOUNT ACTIVATION
router.route("/activate").post(activation);
// LOGIN
router.route("/login").post(loginUser);
// LOGOUT
router.route("/logout").post(logoutUser);
// FORGOT-PASSWORD
router.route("/forgotpassword").post(forgotPassword);
// RESET-PASSWORD
router.route("/resetpassword/:token").post(resetPassword);
// GET ALL USERS
router.route("/getallusers").get(getAllUsers);

export default router;
