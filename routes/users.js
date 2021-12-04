const router = require("express").Router();
const { NotFound, BadRequest } = require("../utils/errors");
const auth = require("../middlewares/auth");
const User = require("../models/user");
const orderById = require("../middlewares/orderById");
const orderByUser = require("../middlewares/ordersByUser");
const productById = require("../middlewares/productById");
const favoritesByUser = require("../middlewares/favoritesByUser");

// Logged in user information
router.get("/", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("orders")
      .select("-password");
    if (!user) throw new NotFound("User not found!");
    res.json(user);
    next();
  } catch (error) {
    next(error);
  }
});

// User orders
router.get("/orders", auth, orderByUser, async (req, res) => {
  res.json(req.orders);
});

// User order detail
router.get("/order/:id", auth, orderById, async (req, res) => {
  res.json(req.order);
});

// User delete order from orders
router.delete("/order/delete/:id", auth, orderById, async (req, res, next) => {
  let order = req.order;

  try {
    await order.remove();

    const user = await User.findById(req.user.id);
    if (!user) throw new NotFound("User not found!");

    const deletedOrder = user.orders.indexOf(req.params.id);
    if (deletedOrder > -1) {
      user.orders.splice(deletedOrder, 1);
    }
    await user.save();

    res.json({
      message: `Order deleted successfully`,
    });
    next();
  } catch (error) {
    next(error);
  }
});

// User add products to favorites
router.put("/add/favorite/:id", auth, productById, async (req, res, next) => {
  const productId = req.product.id;
  const { id } = req.user;
  try {
    const user = await User.findById(id);
    if (!user) throw new NotFound("User not found!");

    const prod = user.favorites.indexOf(productId);
    if (prod > -1) throw new BadRequest("Product is already exist!");
    else {
      user.favorites.push(productId);
    }

    await user.save();
    res.send("Product added successfully to favorites");
    next();
  } catch (error) {
    next(error);
  }
});

// User remove product to favorites
router.delete(
  "/delete/favorite/:id",
  auth,
  productById,
  async (req, res, next) => {
    const productId = req.product.id;
    const { id } = req.user;
    try {
      const user = await User.findById(id);
      if (!user) throw new NotFound("User not found!");

      const prod = user.favorites.indexOf(productId);
      if (prod > -1) {
        user.favorites.splice(prod, 1);
      } else {
        throw new NotFound("Product is not found");
      }

      await user.save();
      res.send("Product removed successfully to favorites");
      next();
    } catch (error) {
      next(error);
    }
  }
);

// User favorites all
router.get("/favorites", auth, favoritesByUser, async (req, res, next) => {
  res.json(req.favorites);
});

module.exports = router;
