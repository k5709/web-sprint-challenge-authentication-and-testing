const jwt = require("jsonwebtoken");
const jwtSecret = require("../secrets/index");

module.exports = (req, res, next) => {
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json("token required");
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    //token is valid, gained access to decoded data if needed

    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json("token invalid");
  }
};
