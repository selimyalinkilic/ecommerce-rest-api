const express = require("express");
const Product = require("../models/product");
const adminAuth = require("../middlewares/adminAuth");
const productById = require("../middlewares/productById");
const { NotFound } = require("../utils/errors");

const router = express.Router();

// Create product
router.post("/create", adminAuth, async (req, res, next) => {
  const { name, description, price, category, photos, quantity } = req.body;

  if (!name || !description || !price || !category || !photos || !quantity) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  let product = new Product({
    ...req.body,
  });

  try {
    await product.save();
    res.json("Product created successfully");
    next();
  } catch (error) {
    next(error);
  }
});

// Getting list products
router.get("/all", async (req, res, next) => {
  let order = req.query.order || "asc";
  let sortBy = req.query.sort || "createdAt";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  try {
    let products = await Product.find({})
      .populate("category")
      .sort([[sortBy, order]])
      .limit(limit)
      .exec();

    if (!products) throw new NotFound("Products not found!");

    res.json(products);
    next();
  } catch (error) {
    next(error);
  }
});

// Search products
router.get("/search", async (req, res, next) => {
  const query = {};

  if (req.query.q) {
    query.name = {
      $regex: req.query.q,
      $options: "i",
    };
  }

  try {
    let products = await Product.find(query);

    if (products.length < 1) {
      throw new NotFound("Nothing found");
    }

    res.json(products);
    next();
  } catch (error) {
    next(error);
  }
});

// Getting product by id
router.get("/:id", productById, async (req, res) => {
  res.json(req.product);
});

// Delete category
router.delete("/delete/:id", adminAuth, productById, async (req, res) => {
  let product = req.product;

  try {
    let deletedProduct = await product.remove();
    res.json({
      message: `${deletedProduct.name} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
