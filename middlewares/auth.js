const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from header
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

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    req.status(401).json({
      message: "Token is not valid",
      error: {
        message: error.message,
        code: error.code,
      },
    });
  }
};
