const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const adminRoute = require("./routes/admin");
const categoryRoute = require("./routes/category");
const productRoute = require("./routes/product");
const ordersRoute = require("./routes/orders");
const handleErrors = require("./middlewares/handleErrors");

dotenv.config();
const app = express();

const port = process.env.PORT || 8181;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, () => {
    console.log("Successfully connected to the MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/users", usersRoute);
app.use("/api/admin", adminRoute);
app.use("/api/category", categoryRoute);
app.use("/api/product", productRoute);
app.use("/api/auth", authRoute);
app.use("/api/orders", ordersRoute);
app.get("/", (req, res) => {
  res.send("Welcome to home page");
});

app.use(handleErrors);

app.listen(port, () => {
  console.log(`Backend server is running at ${port}`);
});
