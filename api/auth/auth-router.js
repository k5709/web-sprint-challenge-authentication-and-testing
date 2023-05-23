const express = require("express");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const restricted = require("../middleware/restricted");
const jwt = require("jsonwebtoken");
router.use(express.json());
const { JWT_SECRET } = require("../../secrets/index");

const users = [];
const user = {
  id: 1,
  username: "Captain Marvel",
  password: "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG",
};
const JWT = JWT_SECRET;

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json("username and password required");
  }

  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(400).json("username taken");
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  const newUser = {
    id: users.length + 1,
    username,
    password: hashedPassword,
  };

  users.push(newUser);

  return res.status(200).json(newUser);
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
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json("username and password required");
  }

  const user = users.find((user) => user.username === username);
  const hashedPassword = bcrypt.hashSync(password, 8);
  if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
    return res.status(400).json("invalid credentials");
  }
  //created token after checking the username
  const token = jwt.sign({ userId: user.id }, JWT);

  res.status(200).json({
    message: `welcome, ${user.username}`,
    token: token,
  });

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

module.exports = router;
