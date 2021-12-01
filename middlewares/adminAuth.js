//const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const { UnAuthorized } = require("../utils/errors.js");

module.exports = async function (req, res, next) {
  const token = req.header("x-auth-token");

  try {
    // Check if no token
    if (!token) throw new UnAuthorized("No token, auth denied");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    next(error);
  }
};
