const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");

const app = express();

dotenv.config();

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, () => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);

app.listen(8181, () => {
  console.log("Backend server is running at 8181!");
});
