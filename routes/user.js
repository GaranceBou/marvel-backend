const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  console.log(req.body);
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.json("Something is missing");
    }
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      const salt = uid2(16);
      const hash = SHA256(req.body.password + salt).toString(encBase64);
      const token = uid2(64);

      const newUser = new User({
        email: req.body.email,
        username: req.body.username,
        token: token,
        hash: hash,
        salt: salt,
      });
      await newUser.save();
      res.status(200).json(newUser);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const userFound = await User.findOne({ email: req.body.email });

    if (!userFound) {
      return res.status(401).json("Email ou password incorrect");
    }
    const newHash = SHA256(req.body.password + userFound.salt).toString(
      encBase64
    );
    console.log(newHash);
    console.log(userFound.hash);
    if (newHash === userFound.hash) {
      const responseObject = {
        _id: userFound._id,
        token: userFound.token,
        username: userFound.username,
      };
      return res.status(200).json(responseObject);
    } else {
      return res.status(401).json("Email ou password incorrect");
    }
  } catch (error) {
    return res.status(500).json({ message: error.messages });
  }
});

module.exports = router;
