import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    activationCode: String,
    resetPasswordToken: String,
    expiryTime: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("Users", userSchema);

export default User;
