const jwt = require("jsonwebtoken");
const jwtSecret = require("../secrets/index");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(400).json("token required");
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    // Token is valid, you can access the decoded data if needed
    req.userId = decoded.userId;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json("token expired");
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json("token invalid");
    }

    return res.status(500).json("Internal Server Error");
  }
};
