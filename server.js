// IMPORTING PACKAGES
import express from "express";

const port = process.env.PORT || 8003;
// CONNNECTING DATABASE

// INITIATING EXPRESS
const app = express();

// MIDDLEWARE
// ROUTES
// CUSTOM MIDDLEWARES
// SERVER LISTENING ON
app.get("/", (req, res) => {
  res.send(`Welcome to URL-Shortner Server Page`);
});
app.listen(port, () => {
  console.log(`Server Running On Port ${port}`);
});
