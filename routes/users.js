const router = require("express").Router();
const { NotFound } = require("../utils/errors");
const auth = require("../middlewares/auth");
const User = require("../models/user");

router.get("/", auth, async (req, res, next) => {
  try {
    // Getting user information by id
    const user = await User.findById(req.user.id).select("-password");
    if (!user) throw new NotFound("User not found!");
    res.json(user);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
