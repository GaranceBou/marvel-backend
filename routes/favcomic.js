const express = require("express");
const router = express.Router();

const User = require("../models/User");
const FavComic = require("../models/FavComic");

const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/favorites/comic", isAuthenticated, async (req, res) => {
  try {
    const existingComic = await FavComic.findOne({
      id: req.body.id,
      owner: req.user,
    });
    if (existingComic) {
      return res.status(400).json("Already a favorite");
    }
    const newFavComic = new FavComic({
      title: req.body.title,
      id: req.body.id,
      description: req.body.description,
      owner: req.user,
    });
    await newFavComic.save();
    res.status(200).json("The comic is now a favorite");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/favorites/comic", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ token: req.user.token });
    const favComic = await FavComic.find({ owner: user._id }).populate(
      "owner",
      "token"
    );
    res.json(favComic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
