const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const User = require("../model/User");

let createUser = async (req, res) => {
  // Create a new user
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

let login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    if (!user) {
      return res
        .status(401)
        .send({ error: "Votre email ou mot de passe est erroné." });
    }
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      error: "Votre email ou mot de passe est erroné.",
      info: error,
    });
  }
};

let me = async (req, res) => {
  try {
    const user = await User.findByEmail(req.params.email);
    if (!user) {
      console.log(user);
      return res.status(401).send({ error: user });
    }
    else {
        res.status(200).send({user})
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      info: error,
    });
  }
};

router.get("/me/:email", auth, me);
router.post("/register", createUser);

router.post("/login", login);

module.exports = {
  router,
};
