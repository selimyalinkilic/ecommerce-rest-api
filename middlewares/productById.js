const mongoose = require("mongoose");
const Product = require("../models/product");

const productById = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(403).json({
      error: "Product not found",
    });
  }

  try {
    let product = await Product.findById(id).populate("category");

    if (!product) {
      return res.status(403).json({
        error: "Product not found",
      });
    }

    req.product = product;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = productById;
