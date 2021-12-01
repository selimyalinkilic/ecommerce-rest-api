const mongoose = require("mongoose");
const Category = require("../models/category");
const { NotFound } = require("../utils/errors");

module.exports = async function (req, res, next) {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFound("Category not found");
    }

    let category = await Category.findById(id);

    if (!category) {
      throw new NotFound("Category not found");
    }

    req.category = category;
    next();
  } catch (error) {
    next(error);
  }
};
