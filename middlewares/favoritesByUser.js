const mongoose = require("mongoose");
const User = require("../models/User");
const { NotFound } = require("../utils/errors");

const favoritesByUser = async (req, res, next) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id);
    if (!user) throw new NotFound("User not found!");

    let favorites = await User.findById(id).select("favorites");
    if (!favorites) throw new NotFound("Favorites not found");

    req.favorites = favorites;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = favoritesByUser;
