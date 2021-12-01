const mongoose = require("mongoose");
const Category = require("../models/category");

module.exports = async function (req, res, next) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(403).json({
      error: "Category not found",
    });
  }

  try {
    let category = await Category.findById(id);

    if (!category) {
      return res.status(403).json({
        error: "Category not found",
      });
    }

    req.category = category;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
