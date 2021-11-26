const router = require("express").Router();
const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

// Register Admin
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
      // Check if admin already exist
      let admin = await Admin.findOne({ email });

      admin &&
        res.status(400).json({
          errors: [
            {
              message: "Admin is already exists!",
            },
          ],
        });

      // Create new admin object
      admin = new Admin({ name, surname, email, password });

      // Generate crypted password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Save password
      admin.password = hashedPassword;

      // Save admin to database
      await admin.save();
      res.status(200).send("Admin is created");
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

// Login Admin
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
      // Find admin
      let admin = await Admin.findOne({ email });

      // If admin not found in db
      !admin &&
        res.status(400).json({
          errors: [
            {
              message: "Admin is not exists!",
            },
          ],
        });

      // If admin exists
      const isMatch = await bcrypt.compare(password, admin.password);

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
        admin: {
          id: admin.id,
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
