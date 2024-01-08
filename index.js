// IMPORTING PACKAGES
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import { connectDb } from "./config/db.js";
import userRouters from "./routes/userRoutes.js";
import urlRouters from "./routes/urlRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

const port = process.env.PORT || 8003;
// CONNNECTING DATABASE
connectDb();
// INITIATING EXPRESS
const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "https://zharty.netlify.app/",
    credentials: true,
  })
);

// ROUTES
app.use("/api/users", userRouters);
app.use("/api/urls", urlRouters);

// SERVER LISTENING ON
app.get("/", (req, res) => {
  res.json({ message: `Welcome to URL-Shortner Server Page` });
});

// CUSTOM MIDDLEWARES
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server Running On Port ${port}`);
});
