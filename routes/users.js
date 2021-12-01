const router = require("express").Router();
const auth = require("../middlewares/auth");
const User = require("../models/user");

router.get("/", auth, async (req, res) => {
  try {
    // Getting user information by id
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
