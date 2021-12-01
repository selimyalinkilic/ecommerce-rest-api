const express = require("express");
const Category = require("../models/category");
const { check, validationResult } = require("express-validator");
const adminAuth = require("../middlewares/adminAuth");
const categoryById = require("../middlewares/categoryById");
const router = express.Router();
const { NotFound, IsExist, BadRequest } = require("../utils/errors");

// Creating new category
router.post(
  "/create",
  [check("name", "Name is required").trim().not().isEmpty()],
  adminAuth,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new BadRequest(errors.array()[0].msg);

    const { name } = req.body;
    try {
      let category = await Category.findOne({ name });

      if (category) throw new IsExist("Category is already exist!");

      const newCategory = new Category({ name });
      category = await newCategory.save();
      res.json(category);
      next();
    } catch (error) {
      next(error);
    }
  }
);

// Getting all categories
router.get("/all", async (req, res, next) => {
  try {
    let data = await Category.find({});
    if (!data) throw new NotFound("Categories not found!");
    res.json(data);
    next();
  } catch (error) {
    next(error);
  }
});

// Getting category by id
router.get("/:id", categoryById, async (req, res) => {
  res.json(req.category);
});

// Update category
router.put(
  "/update/:id",
  adminAuth,
  categoryById,
  [
    check("name", "Name is required").trim().not().isEmpty(),
    check("name", "Name is the same as before").trim().not().exists(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw new BadRequest(errors.array()[0].msg);
      next();
    } catch (error) {
      next(error);
    }

    let category = req.category;
    const { name } = req.body;

    if (name) category.name = name.trim();

    try {
      category = await category.save();
      res.json(category);
      next();
    } catch (error) {
      next(error);
    }
  }
);

// Delete category
router.delete(
  "/delete/:id",
  adminAuth,
  categoryById,
  async (req, res, next) => {
    let category = req.category;

    try {
      let deletedCategory = await category.remove();
      res.json({
        message: `${deletedCategory.name} deleted successfully`,
      });
      next();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
