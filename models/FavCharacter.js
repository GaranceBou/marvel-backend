const mongoose = require("mongoose");

const FavCharacter = mongoose.model("FavCharacter", {
  id: String,
  name: String,
  description: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = FavCharacter;
