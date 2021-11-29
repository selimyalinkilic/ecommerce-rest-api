const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      required: true,
    },
    discount: {
      type: Number,
      required: false,
    },
    photos: [
      {
        url: {
          type: String,
          required: false,
        },
      },
    ],
    shipping: {
      type: Boolean,
      default: false,
      required: false,
    },
    published: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = Product = mongoose.model("Product", ProductSchema);
