const express = require("express");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const restricted = require("../middleware/restricted");
const { checkUsernameExists, validateBody } = require("./auth-middleware");
const User = require("./auth.model");
const JWT_SECRET = require("../secrets/index");
const jwt = require("jsonwebtoken");

router.use(express.json());

router.post(
  "/register",
  checkUsernameExists,
  validateBody,
  async (req, res, next) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const user = { username: username, password: hashedPassword };

    try {
      const newUser = await User.add(user);

      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        password: newUser.password,
      });
    } catch (error) {
      next(error);
    }

    // const { username, password } = req.body;

    // if (!username || !password) {
    //   return res.status(400).json("username and password required");
    // }

    // const hashedPassword = bcrypt.hashSync(password, 8);

    // const newUser = {
    //   username,
    //   password: hashedPassword,
    // };

    // const existingUser = db.get("users").find({ username }).value();
    // if (existingUser) {
    //   return res.status(400).json("username taken");
    // }

    // const createdUser = db.get("users").insert(newUser).write();

    // return res.status(200).json({
    //   id: createdUser.id,
    //   username: createdUser.username,
    //   password: createdUser.password,
    // });

    /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
  }
);

router.post("/login", validateBody, async (req, res, next) => {
  const { username, password } = req.body;

  const newUser = await User.findBy({ username });
  const user = newUser[0];

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = buildToken(user);
    next({ message: `welcome back, ${user.username}`, token: token });
  } else {
    return res.status(401).json("invalid credentials");
  }

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

function buildToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

module.exports = router;
