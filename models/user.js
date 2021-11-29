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
    addresses: [
      {
        title: {
          type: String,
          required: true,
          unique: true,
        },
        name: {
          type: String,
          required: true,
        },
        surname: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        district: {
          type: String,
          required: true,
        },
        fullAddress: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: false,
        },
        email: {
          type: String,
          required: false,
        },
      },
    ],
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
