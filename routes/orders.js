const express = require("express");
const Order = require("../models/order");
const User = require("../models/user");
const { check, validationResult } = require("express-validator");
const auth = require("../middlewares/auth");
const adminAuth = require("../middlewares/adminAuth");
const orderById = require("../middlewares/orderById");
const generateOrderNumber = require("../utils/generateOrderNumber");
const router = express.Router();
const { NotFound, IsExist, BadRequest } = require("../utils/errors");

// Creating new order
router.post(
  "/create",
  [
    check("orderProducts", "Products is required").not().isEmpty(),
    check("shipping", "Shipping is required").trim().not().isEmpty(),
    check("totalAmount", "Total amount is required").trim().not().isEmpty(),
  ],
  auth,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new BadRequest(errors.array()[0].msg);

    const {
      orderNumber,
      orderUser,
      orderProducts,
      shipping,
      shippingAdress,
      taxAddress,
      totalQuantity,
      totalAmount,
    } = req.body;
    try {
      let order = await Order.findOne({ orderNumber });

      if (order) throw new IsExist("Order is already exist!");

      const newOrder = new Order({
        orderNumber,
        orderUser,
        orderProducts,
        shipping,
        shippingAdress,
        taxAddress,
        totalQuantity,
        totalAmount,
      });

      newOrder.orderNumber = generateOrderNumber();
      const user = await User.findById(req.user.id).select("-password");
      if (!user) throw new NotFound("User not found!");

      newOrder.orderUser = user.id;
      order = await newOrder.save();

      user.orders.push(order);
      await user.save();
      res.json(order);
      next();
    } catch (error) {
      next(error);
    }
  }
);

// Delete order
router.delete(
  "/admin/delete/:id",
  adminAuth,
  orderById,
  async (req, res, next) => {
    let order = req.order;

    try {
      await order.remove();
      res.json({
        message: `Order deleted successfully`,
      });
      next();
    } catch (error) {
      next(error);
    }
  }
);

// Get all orders
router.get("/all", adminAuth, async (req, res, next) => {
  try {
    let data = await Order.find({});
    if (!data) throw new NotFound("Orders not found!");
    res.json(data);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
