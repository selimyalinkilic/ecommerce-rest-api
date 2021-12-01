const jwt = require("jsonwebtoken");
const { UnAuthorized } = require("../utils/errors.js");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) throw new UnAuthorized("No token, auth denied");

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    next(error);
  }
};
