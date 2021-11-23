const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, () => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(8181, () => {
  console.log("Backend server is running at 8181!");
});
