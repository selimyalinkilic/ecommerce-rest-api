const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const { IsExist, BadRequest } = require("../utils/errors");
// Register User
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("surname", "Surname is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res, next) => {
    // Control error
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new BadRequest(errors.array()[0].msg);

    // Getting name, surname, email and password from request
    const { name, surname, email, password } = req.body;

    try {
      // Check if user already exist
      let user = await User.findOne({ email });

      if (user) throw new IsExist("User is already exist!");

      // Create new user object
      user = new User({ name, surname, email, password });

      // Generate crypted password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Save password
      user.password = hashedPassword;

      // Save user to database
      await user.save();
      res.status(200).send("User is created");
      next();
    } catch (error) {
      next(error);
    }
  }
);

// Login User
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is reqired").exists(),
  ],
  async (req, res, next) => {
    // Control error
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new BadRequest(errors.array()[0].msg);

    // Getting email and password from request body
    const { email, password } = req.body;

    try {
      // Find user
      let user = await User.findOne({ email });

      // If user not found in db
      if (!user) throw new IsNotExists("User is not exist!");

      // If user exists
      const isMatch = await bcrypt.compare(password, user.password);

      // If password doesn't match
      if (!isMatch) throw new BadRequest("Password is wrong!");

      // Payload for jwt
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
          });
        }
      );
      next();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
