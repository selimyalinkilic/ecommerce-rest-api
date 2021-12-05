const mongoose = require("mongoose");
const User = require("../models/user");
const { NotFound } = require("../utils/errors");

const orderByUser = async (req, res, next) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id);
    if (!user) throw new NotFound("User not found!");

    let orders = await User.findById(id).select("orders");
    if (!orders) throw new NotFound("Orders not found");

    req.orders = orders;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = orderByUser;
