// import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

// REGISTRATION - POST /api/users/register
export const registerUser = asyncHandler(async (req, res) => {
  const { fisrtName, lastName, email, password } = req.body;
  res.json({ message: `Register User` });
});
// LOGIN - POST /api/users/login
export const loginUser = asyncHandler(async (req, res) => {
  res.json({ message: `User Logged In` });
});
// LOGOU - POST /api/users/logout
export const logoutUser = asyncHandler(async (req, res) => {
  res.json({ message: `User Logged Out` });
});
// FORGOT_PASSWORD - POST /api/users/forgotpassword
export const forgotPassword = asyncHandler(async (req, res) => {
  res.json({ message: `Reset Email Sent Successfully` });
});
// REST_PASSWORD - PUT /api/users/resetpassword
export const resetPassword = asyncHandler(async (req, res) => {
  res.json({ message: `Password Resetted Successfully` });
});
// GET ALL USERS - GET /api/users/getallusers
export const getAllUsers = asyncHandler(async (req, res) => {
  res.json({ message: `All Users Data Fetched` });
});
