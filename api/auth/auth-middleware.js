const { JWT_SECRET } = require("../../secrets/index");
const User = require("./auth.model");

const checkUsernameExists = async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json("username and password required");
    }
    const newUser = await User.findBy({ username });
    if (newUser[0]) {
      res.status(422).json("username taken");
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  checkUsernameExists,
};
