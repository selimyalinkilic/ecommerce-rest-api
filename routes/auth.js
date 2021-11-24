const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

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
  async (req, res) => {
    const errors = validationResult(req);
    // Control error
    !errors.isEmpty() &&
      res.status(400).json({
        errors: errors.array(),
      });

    // Getting name, surname, email and password from request
    const { name, surname, email, password } = req.body;

    try {
      // Check if user already exist
      let user = await User.findOne({ email });

      user &&
        res.status(400).json({
          errors: [
            {
              message: "User is already exists!",
            },
          ],
        });

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
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
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
  async (req, res) => {
    const errors = validationResult(req);
    // Control error
    if (!errors.isEmpty()) {
      res.status(400).json({
        errors: errors.array(),
      });
    }
    // Getting email and password from request body
    const { email, password } = req.body;

    try {
      // Find user
      let user = await User.findOne({ email });

      // If user not found in db
      !user &&
        res.status(400).json({
          errors: [
            {
              message: "User is not exists!",
            },
          ],
        });

      // If user exists
      const isMatch = await bcrypt.compare(password, user.password);

      // If password doesn't match
      !isMatch &&
        res.status(400).json({
          errors: [
            {
              message: "Password is wrong!",
            },
          ],
        });

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
    } catch (error) {}
  }
);

module.exports = router;
