// IMPORTING PACKAGES
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import { connectDb } from "./config/db.js";

const port = process.env.PORT || 8003;
// CONNNECTING DATABASE
connectDb();
// INITIATING EXPRESS
const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// ROUTES

// CUSTOM MIDDLEWARES

// SERVER LISTENING ON
app.get("/", (req, res) => {
  res.send(`Welcome to URL-Shortner Server Page`);
});
app.listen(port, () => {
  console.log(`Server Running On Port ${port}`);
});
