const express = require("express");
const Category = require("../models/category");
const { check, validationResult } = require("express-validator");
const adminAuth = require("../middlewares/adminAuth");
const categoryById = require("../middlewares/categoryById");
const router = express.Router();

// Creating new category
router.post(
  "/create",
  [check("name", "Name is required").trim().not().isEmpty()],
  adminAuth,
  async (req, res) => {
    const errors = validationResult(req);
    !errors.isEmpty() &&
      res.status(400).json({
        error: errors.array()[0].msg,
      });

    const { name } = req.body;
    try {
      let category = await Category.findOne({ name });

      category &&
        res.status(403).json({
          error: "Category already exist",
        });

      const newCategory = new Category({ name });
      category = await newCategory.save();
      res.json(category);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  }
);

// Getting all categories
router.get("/all", async (req, res) => {
  try {
    let data = await Category.find({});
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
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
  async (req, res) => {
    const errors = validationResult(req);
    !errors.isEmpty() &&
      res.status(400).json({
        error: errors.array()[0].msg,
      });

    let category = req.category;
    const { name } = req.body;

    if (name) category.name = name.trim();

    try {
      category = await category.save();
      res.json(category);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  }
);

// Delete category
router.delete("/delete/:id", adminAuth, categoryById, async (req, res) => {
  let category = req.category;

  try {
    let deletedCategory = await category.remove();
    res.json({
      message: `${deletedCategory.name} deleted successfully`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
