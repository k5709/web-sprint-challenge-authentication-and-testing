// const { JWT_SECRET } = require("../../secrets/index");
const User = require("./auth.model");

const checkUsernameExists = async (req, res, next) => {
  try {
    const { username } = req.body;
    const newUser = await User.findBy({ username });
    if (newUser[0]) {
      next({
        status: 422,
        message: "The username is already taken",
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

const validateBody = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (
      !username ||
      !password ||
      typeof password !== "string" ||
      !password.trim() ||
      !username.trim()
    ) {
      return res.status(400).json({message: "username and password required"})
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};
module.exports = {
  checkUsernameExists,
  validateBody,
};
