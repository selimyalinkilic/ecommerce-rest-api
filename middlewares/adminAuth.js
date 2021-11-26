const Admin = require("../models/admin");

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
    //Getting admin information by Id
    const admin = await Admin.findOne({
      _id: req.id,
    });

    if (!admin) {
      console.log("error");
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};
