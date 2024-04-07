const mongoose = require("mongoose");

const FavComic = mongoose.model("FavComic", {
  id: String,
  title: String,
  description: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = FavComic;
