const mongoose = require("mongoose");
const Product = require("../models/product");
const { NotFound } = require("../utils/errors");

const productById = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFound("Product not found");

    let product = await Product.findById(id).populate("category");

    if (!product) throw new NotFound("Product not found");

    req.product = product;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = productById;
