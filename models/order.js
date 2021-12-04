const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    orderUser: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    orderProducts: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    shipping: {
      type: Boolean,
      required: true,
    },
    shippingAdress: {
      type: String,
      required: false,
    },
    taxAddress: {
      type: String,
      required: false,
    },
    totalQuantity: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);
