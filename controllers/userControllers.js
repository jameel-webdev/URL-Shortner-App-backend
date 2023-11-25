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
    activateCodeExpires: Date.now() + 15 * 60 * 1000,
  });
  if (newUser) {
    return res.status(201).json({
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      message: `Registration Success, Activation Code Sent To Your ${newUser.email}`,
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
  const user = await User.findOne({
    activationCode: decodedCode,
    activateCodeExpires: { $gt: Date.now() },
  });
  if (user) {
    user.activationCode = "";
    user.activateCodeExpires = "";
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
  if (!user) throw new Error(`Invalid Credentials`);
  // user Exists
  if (user && user.isActive) {
    const isPasswordValid = await validatingPassword(password, user.password);
    if (isPasswordValid) {
      generateToken(res, user._id);
      res.status(200).json({ user, message: `User Logged In Successfully` });
    } else {
      res.status(400).json({
        message: `Invalid Credentials`,
      });
    }
  } else {
    res.status(400);
    throw new Error(
      `Your account is not activated, Kindly activate your account`
    );
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
  const { email } = req.body;
  //check the user
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: `Invalid User Detail` });

  if (user) {
    const resetCode = crypto.randomBytes(20).toString("hex");
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");
    const savingToken = await User.updateOne(
      {
        _id: user._id,
      },
      {
        resetPasswordToken: hashedResetCode,
        resetTokenExpires: Date.now() + 15 * 60 * 1000,
      }
    );
    const url = `${process.env.FRONTEND_URL}/resetpassword/${resetCode}`;
    const text = `Click the link to reset your account password ${url}. If you have not requested kindly ignore this mail`;

    await sendMail(user.email, "Reset Account Password", text);
    return res.status(200).json({
      message: `Link to reset password has been sent to your ${user.email}`,
    });
  }
});

// REST_PASSWORD - PUT /api/users/resetpassword
export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  if (!password)
    return res.status(400).json({ message: `Provide New Password` });
  const hashPassword = await generateHashPassword(password);
  console.log(hashPassword);
  const { token } = req.params;
  const decodedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: decodedToken,
    resetTokenExpires: { $gt: Date.now() },
  });
  if (!user)
    return res.status(400).json({ message: `Invalid Token or Expired` });
  if (user) {
    user.password = hashPassword;
    user.resetPasswordToken = "";
    user.resetTokenExpires = "";
    await user.save();
    return res.status(200).json({ message: `Password Changed Successfully` });
  }
});
// GET ALL USERS - GET /api/users/getallusers
export const getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = await User.find({});
  return res.status(200).json({ allUsers, message: `All Users Data Fetched` });
});
