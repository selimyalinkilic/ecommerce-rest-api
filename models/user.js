const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
    },
    surname: {
      type: String,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    phone: {
      type: String,
    },
    addresses: {
      type: Array,
      default: [],
    },
    orders: {
      type: Array,
      default: [],
    },
    favorites: {
      type: Array,
      default: [],
    },
    customLists: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("User", UserSchema);
