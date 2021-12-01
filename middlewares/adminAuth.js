const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  const token = req.header("x-auth-token");

  // Check if no token
  !token &&
    res.status(401).json({
      errors: [
        {
          message: "No token, auth denied",
        },
      ],
    });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};
