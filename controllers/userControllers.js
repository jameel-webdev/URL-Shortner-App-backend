import crypto from "crypto";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import {
  generateHashPassword,
  validatingPassword,
} from "../utils/generateHashedPassword.js";
import { sendMail } from "../utils/sendMail.js";
import { generateToken } from "../utils/generateToken.js";

// REGISTRATION - POST /api/users/register
export const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  // Inputs-check
  if (!firstName || !lastName || !email || !password)
    return res.status(400).json({
      message: `Please Fill All the Details`,
    });
  // Existing user-check
  if (email) {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: `User Already Exists` });
  }
  // Creating newUser
  const hashPassword = await generateHashPassword(password);
  const activationCode = crypto.randomBytes(15).toString("hex");
  const hashedActiveCode = crypto
    .createHash("sha256")
    .update(activationCode)
    .digest("hex");
  const text = `Your Account Registration is Successfull. Here is Your Activation Code : ${activationCode} Activate your account to use the URL-Shortner App`;
  await sendMail(
    email,
    "Activate Your Registered URL-Shortner-App Account",
    text
  );
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashPassword,
    activationCode: hashedActiveCode,
    expiresTimes: Date.now() + 15 * 60 * 1000,
  });
  if (newUser) {
    return res.status(201).json({
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      message: `Registration Success, Activation Link Sent To Your ${newUser.email}`,
    });
  } else {
    res.status(400);
    throw new Error(`Invalid User Data`);
  }
});

// ACCOUNT ACTIVATION - POST /api/users/activate
export const activation = asyncHandler(async (req, res) => {
  const { activeToken } = req.body;
  // decoding hashed activationCode
  const decodedCode = crypto
    .createHash("sha256")
    .update(activeToken)
    .digest("hex");
  console.log(decodedCode);
  const user = await User.findOne({
    activationCode: decodedCode,
  });
  if (user) {
    user.activationCode = "";
    user.expiryTime = "";
    user.isActive = true;
    await user.save();
    res.status(200).json({ message: `Your Account is Activate Now` });
  } else {
    res.status(400);
    throw new Error(`Activation Code is Not Valid or Expired`);
  }
});

// LOGIN - POST /api/users/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //input checks
  if (!email || !password)
    return res.status(400).json({ message: `Please Fill All The Inputs` });
  // Find the User
  const user = await User.findOne({ email });
  // user Exists
  if (user) {
    const isAccountActive = user.isActive;
    if (isAccountActive) {
      const isPasswordValid = await validatingPassword(password, user.password);
      if (isPasswordValid) {
        generateToken(res, user._id);
        res.status(200).json({ user, message: `User Logged In Successfully` });
      }
    } else {
      res.status(400).json({
        message: `Your account is not activated, Kindly activate your account`,
      });
    }
  } else {
    res.status(401);
    throw new Error(`Invalid Credentials`);
  }
});

// LOGOU - POST /api/users/logout
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return res.status(200).json({ message: `User Logged Out Successfully` });
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
