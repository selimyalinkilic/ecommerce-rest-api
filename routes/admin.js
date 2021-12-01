const router = require("express").Router();
const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const { IsExist, BadRequest } = require("../utils/errors");

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
  async (req, res, next) => {
    // Control error
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new BadRequest(errors.array()[0].msg);

    // Getting name, surname, email and password from request
    const { name, surname, email, password } = req.body;

    try {
      // Check if admin already exist
      let admin = await Admin.findOne({ email });

      if (admin) throw new IsExist("Admin is already exist!");

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
      next();
    } catch (error) {
      next(error);
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
  async (req, res, next) => {
    // Control error
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new BadRequest(errors.array()[0].msg);
    // Getting email and password from request body
    const { email, password } = req.body;

    try {
      // Find admin
      let admin = await Admin.findOne({ email });

      // If admin not found in db
      if (!admin) throw new IsNotExists("Admin is not exist!");

      // If admin exists
      const isMatch = await bcrypt.compare(password, admin.password);

      // If password doesn't match
      if (!isMatch) throw new BadRequest("Password is wrong!");

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
      next();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
