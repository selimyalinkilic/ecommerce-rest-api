const mongoose = require("mongoose");
import Order from "../models/Order";
const { NotFound } = require("../utils/errors");

const orderById = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFound("Order not found");

    let order = await Order.findById(id);
    if (!order) throw new NotFound("Order not found");

    req.order = order;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = orderById;
