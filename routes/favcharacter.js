const express = require("express");
const router = express.Router();

const User = require("../models/User");
const FavCharacter = require("../models/FavCharacter");

const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/favorites/character", isAuthenticated, async (req, res) => {
  try {
    const existingCharacter = await FavCharacter.findOne({
      id: req.body.id,
      owner: req.user,
    });
    if (existingCharacter) {
      return res.status(400).json("Already a favorite");
    }
    const newFavCharacter = new FavCharacter({
      name: req.body.name,
      id: req.body.id,
      description: req.body.description,
      owner: req.user,
    });
    await newFavCharacter.save();
    res.status(200).json("The character is now a favorite");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/favorites/character", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ token: req.user.token });
    const favCharacter = await FavCharacter.find({ owner: user._id }).populate(
      "owner",
      "token"
    );
    console.log(favCharacter);
    res.json(favCharacter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
